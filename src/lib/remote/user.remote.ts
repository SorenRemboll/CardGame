import { query, getRequestEvent } from '$app/server';
import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

export const cancelSearch = query(async () => {
	const event = getRequestEvent();
	const user = event.locals.user;

	if (!user) {
		error(401, 'User not authenticated');
	}

	const updatedUser = await prisma.user.update({
		where: { id: user.id },
		data: { GameState: 'IDLE' }
	});

	return {
		success: true,
		state: updatedUser.GameState
	};
});

const startTestBattleInputSchema = z.object({
	deckId: z.number().int().positive()
});

/** Dev/test helper: put the user into IN_BATTLE with the chosen deck and create a solo game. */
export const startTestBattle = query(startTestBattleInputSchema, async (input) => {
	const event = getRequestEvent();
	const user = event.locals.user;

	if (!user) {
		error(401, 'User not authenticated');
	}

	const parsed = startTestBattleInputSchema.safeParse(input);
	if (!parsed.success) {
		error(400, parsed.error.issues[0]?.message ?? 'Invalid input');
	}

	const { deckId } = parsed.data;

	const deck = await prisma.deck.findFirst({
		where: { id: deckId, userId: user.id },
		include: { deckCards: true }
	});

	if (!deck) {
		error(404, 'Deck not found');
	}

	if (deck.deckCards.length === 0) {
		error(400, 'Deck has no cards');
	}

	// Clear any leftover in-progress games so hooks picks up the new test match
	await prisma.game.updateMany({
		where: {
			status: 'IN_PROGRESS',
			OR: [{ attackerId: user.id }, { defenderId: user.id }]
		},
		data: { status: 'CANCELLED' }
	});

	const game = await prisma.game.create({
		data: {
			attackerId: user.id,
			attackerDeckId: deck.id,
			status: 'IN_PROGRESS',
			currentTurn: 1,
			attackerHealth: 20,
			defenderHealth: 20,
			attackerMaxHealth: 20,
			defenderMaxHealth: 20
		}
	});

	await prisma.user.update({
		where: { id: user.id },
		data: {
			GameState: 'IN_BATTLE',
			currentGameId: game.id
		}
	});

	return {
		success: true,
		gameId: game.id,
		deckId: deck.id
	};
});
