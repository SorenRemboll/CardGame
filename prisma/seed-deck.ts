import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma/client.js';
import {
	DECK_DESCRIPTION_MAX_LENGTH,
	DECK_NAME_MAX_LENGTH,
	DECK_SIZE,
	DECK_SLOTS_CAP_AMOUNT
} from '../src/lib/consts/User.consts.ts';

/** Matches Deck.addCardToDeck — server zod allows 4, UI caps at 2. */
const MAX_COPIES_PER_CARD = 2;

const {
	MYSQL_DATABASE_HOST,
	MYSQL_DATABASE_PORT,
	MYSQL_DATABASE_USER,
	MYSQL_DATABASE_PASSWORD,
	MYSQL_DATABASE_NAME
} = process.env;

if (
	!MYSQL_DATABASE_HOST ||
	!MYSQL_DATABASE_PORT ||
	!MYSQL_DATABASE_USER ||
	!MYSQL_DATABASE_PASSWORD ||
	!MYSQL_DATABASE_NAME
) {
	console.error('Missing required environment variables. Check your .env file.');
	process.exit(1);
}

const userId = Number.parseInt(process.argv[2] ?? '', 10);
if (!Number.isInteger(userId) || userId < 1) {
	console.error('Usage: bun run prisma/seed-deck.ts <userId>');
	process.exit(1);
}

const adapter = new PrismaMariaDb({
	host: MYSQL_DATABASE_HOST,
	port: parseInt(MYSQL_DATABASE_PORT),
	user: MYSQL_DATABASE_USER,
	password: MYSQL_DATABASE_PASSWORD,
	database: MYSQL_DATABASE_NAME,
	allowPublicKeyRetrieval: true
});

const prisma = new PrismaClient({ adapter });

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Build a legal card list: exactly DECK_SIZE copies, ≤ MAX_COPIES_PER_CARD each. */
function buildDeckCards(cardIds: number[]): { cardId: number; quantity: number }[] {
	const minUniqueNeeded = Math.ceil(DECK_SIZE / MAX_COPIES_PER_CARD);
	if (cardIds.length < minUniqueNeeded) {
		throw new Error(
			`Need at least ${minUniqueNeeded} cards in the library to fill a ${DECK_SIZE}-card deck (max ${MAX_COPIES_PER_CARD} copies). Found ${cardIds.length}.`
		);
	}

	const pool = shuffle(cardIds);
	const picks: { cardId: number; quantity: number }[] = [];
	let remaining = DECK_SIZE;
	let i = 0;

	while (remaining > 0 && i < pool.length) {
		const maxQty = Math.min(MAX_COPIES_PER_CARD, remaining);
		const quantity = remaining <= MAX_COPIES_PER_CARD
			? remaining
			: Math.floor(Math.random() * maxQty) + 1;
		picks.push({ cardId: pool[i], quantity });
		remaining -= quantity;
		i++;
	}

	if (remaining > 0) {
		throw new Error(`Could not fill deck: still need ${remaining} cards.`);
	}

	return picks;
}

async function seedDeck() {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { id: true, userName: true, _count: { select: { Deck: true } } }
	});

	if (!user) {
		console.error(`User ${userId} not found.`);
		process.exit(1);
	}

	if (user._count.Deck >= DECK_SLOTS_CAP_AMOUNT) {
		console.error(
			`User ${user.userName} (#${user.id}) already has ${user._count.Deck}/${DECK_SLOTS_CAP_AMOUNT} decks.`
		);
		process.exit(1);
	}

	const library = await prisma.cardData.findMany({ select: { id: true, name: true } });
	if (library.length === 0) {
		console.error('No cards in the library. Run the card seed first (`bun run db:seed`).');
		process.exit(1);
	}

	const deckCards = buildDeckCards(library.map((c) => c.id));
	const nameBase = `Seeded Deck ${user._count.Deck + 1}`;
	const name = nameBase.slice(0, DECK_NAME_MAX_LENGTH);
	const description = `Auto-generated ${DECK_SIZE}-card deck`.slice(0, DECK_DESCRIPTION_MAX_LENGTH);

	const deck = await prisma.deck.create({
		data: {
			name,
			description,
			userId: user.id,
			deckCards: {
				create: deckCards
			}
		},
		include: {
			deckCards: { include: { card: { select: { name: true } } } }
		}
	});

	const total = deck.deckCards.reduce((sum, dc) => sum + dc.quantity, 0);
	console.log(`✓ Deck #${deck.id} "${deck.name}" for ${user.userName} (#${user.id})`);
	console.log(`  ${total}/${DECK_SIZE} cards, ${deck.deckCards.length} unique`);
	for (const dc of deck.deckCards) {
		console.log(`  · ${dc.quantity}× ${dc.card.name}`);
	}
}

seedDeck()
	.catch((error) => {
		console.error(error instanceof Error ? error.message : error);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
