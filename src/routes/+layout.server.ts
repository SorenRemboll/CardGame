import { prisma } from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	if (locals.user) {
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
				user: locals.user
			};
		}
		// Flatten deckCards to cards with quantity
		const formattedDecks = decks.map((deck) => ({
			id: deck.id,
			name: deck.name,
			description: deck.description,
			cards: deck.deckCards.map(dc => ({
				...dc.card,
				quantity: dc.quantity
			}))
		}));
		return {
			decks: formattedDecks,
			user: locals.user
		};
	}
	return {
		user: locals.user,
	};
};