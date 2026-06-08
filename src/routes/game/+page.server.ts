import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { ROUTES } from '$lib/consts/routes';
import { prisma } from '$lib/prisma';
export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        redirect(307, '/login');
    }
    if (locals.user.gameState !== 'IN_BATTLE' && locals.user.gameId === null) {
        redirect(307, ROUTES.CHARACTER);
    }
    // get game and attacker and defender
    const game = await prisma.game.findUnique({
        where: { id: locals.user.gameId! },
        include: {
            messages: {
                select: { id: true, content: true, userName: true, userId: true, time_created: true }
            },
            attacker: {
                select: { id: true, userName: true }
            },
            defender: {
                select: { id: true, userName: true }
            },
            attackerDeck: {
                include: {
                    deckCards: true,
                },
                omit: {
                    time_created: true,
                    time_updated: true,
                    userId: true,
                    id: true,
                    description: true,
                }
            },
            defenderDeck: {
                include: {
                    deckCards: true,
                },
                omit: {
                    time_created: true,
                    time_updated: true,
                    userId: true,
                    id: true,
                    description: true,
                }
            },

        },
        omit: {
            time_updated: true,
            attackerDeckId: true,
            defenderDeckId: true,
            attackerId: true,
            defenderId: true,
        }

    });
    return {
        game
    }
};