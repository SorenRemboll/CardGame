import { prisma } from '$lib/prisma';
import type { CardDTO } from '$lib/types/dtos';
import type { CardType } from '@prisma-app/client';
import type { LayoutServerLoad } from './$types';

function toCardDTO(
	card: {
		id: number;
		name: string;
		type: CardType;
		description: string;
		siege: number;
		bastion: number;
		spirit_cost: number;
		health: number;
	},
	quantity: number
): CardDTO {
	return {
		id: card.id,
		name: card.name,
		type: card.type,
		description: card.description,
		siege: card.siege,
		bastion: card.bastion,
		spirit_cost: card.spirit_cost,
		health: card.health,
		quantity
	};
}

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return {
			user: locals.user,
		};
	}

	const decks = await prisma.deck.findMany({
		where: {
			userId: locals.user.id,
		},
		include: {
			deckCards: {
				include: {
					card: true
				}
			}
		}
	});
	if (!decks || decks.length === 0) {
		return {
			decks: [],
			user: locals.user,
		};
	}
	const formattedDecks = decks.map((deck) => ({
		id: deck.id,
		name: deck.name,
		description: deck.description ?? '',
		cards: deck.deckCards.map((dc) => toCardDTO(dc.card, dc.quantity))
	}));
	return {
		decks: formattedDecks,
		user: locals.user,
	};
};