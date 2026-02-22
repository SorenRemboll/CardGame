// hooks.server.ts
import { COOKIE_NAME } from '$env/static/private';
import { BATTLE_ROUTES, PROTECTED_ROUTES, ROUTES } from '$lib/consts/routes';
import { prisma } from '$lib/prisma';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve, }) => {
    // This is a workaround for the devtools issue
    if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) { return new Response(null, { status: 204 }) }
    const { cookies } = event;
    const sessionId = cookies.get(COOKIE_NAME);
    if (PROTECTED_ROUTES.some(route => event.url.pathname.startsWith(route)) && !sessionId) {
        return redirect(307, ROUTES.LOGIN);
    }
    const user = await prisma.user.findUnique({
        where: { sessionID: sessionId },
        select: {
            id: true,
            userName: true,
            GameState: true,
        },
    });

    if (user) {
        let gameId: string | null = null;
        if (user.GameState === 'IN_BATTLE') {
            const currentGame = await prisma.game.findFirst({
                where: {
                    status: 'IN_PROGRESS',
                    OR: [{ player1Id: user.id }, { player2Id: user.id }],
                },
                select: { id: true },
                orderBy: { time_created: 'desc' },
            });
            gameId = currentGame?.id ?? null;
        }

        event.locals.user = {
            id: user.id,
            userName: user.userName,
            gameState: user.GameState,
            gameId,
        };
    }
    if (event.locals.user?.gameState === "SEARCHING" && !event.url.pathname.includes('/api/')) {
        // If user is in searching state, send the user to the loading page
        if (!event.url.pathname.startsWith(ROUTES.LOADING)) {
            return redirect(307, ROUTES.LOADING);
        }
    }
    if (
        event.locals.user?.gameState === "IN_BATTLE" &&
        !event.url.pathname.includes('/api/') &&
        !event.url.pathname.startsWith(ROUTES.GAME)
    ) {
        return redirect(307, ROUTES.GAME);
    }

    return await resolve(event);
};