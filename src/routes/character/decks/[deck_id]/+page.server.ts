import { prisma } from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
    if (params.deck_id === 'new-deck' || isNaN(parseInt(params.deck_id)) || !locals.user) {
        return {}
    }
    const deck_id = parseInt(params.deck_id);
    const deck = await prisma.deck.findUnique({
        where: {
            id: deck_id,
            userId: locals.user.id
        },
        include: {
            deckCards: {
                include: {
                    card: true
                }
            }
        }
    });
    if (!deck) {
        return {}
    };

    // Expand deckCards into flat cards array (respecting quantity)
    const cards = deck.deckCards.flatMap(dc =>
        Array(dc.quantity).fill(dc.card)
    );

    return {
        deck: {
            id: deck.id,
            name: deck.name,
            description: deck.description ?? '',
            cards
        }
    };

}