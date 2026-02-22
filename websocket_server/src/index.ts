import type { ServerWebSocket } from 'bun';
import { prisma } from './prisma';

// Map sessionId -> WebSocket for active connections that are searching
// DB is source of truth for GameState (SEARCHING); map only for sending messages
const searchingSockets = new Map<string, ServerWebSocket<unknown>>();
// Map sessionId -> deckId selected when queuing (so we can store it on the Game when matched)
const searchingDeckIds = new Map<string, number>();

const server = Bun.serve({
    port: 8888,

    async fetch(req, server) {
        const url = new URL(req.url);

        if (url.pathname === '/health') {
            try {
                await prisma.$queryRaw`SELECT 1`;
                return Response.json({ status: 'healthy', db: 'connected' });
            } catch {
                return Response.json({ status: 'unhealthy', db: 'disconnected' }, { status: 500 });
            }
        }

        if (url.pathname === '/ws') {
            const upgraded = server.upgrade(req);
            if (upgraded) return undefined;
            return new Response('WebSocket upgrade failed', { status: 400 });
        }

        return new Response('WebSocket Server OK');
    },

    websocket: {
        open(ws) {
            console.log('Client connected');
            ws.send(JSON.stringify({ type: 'connected' }));
        },

        async message(ws, message) {
            const data = JSON.parse(message.toString());
            console.log('Received:', data.type);

            if (data.type === 'find_game' && data.sessionId && data.deckId) {
                await handleFindGame(ws, data.sessionId, data.deckId);
                return;
            }

            if (data.type === 'cancel_search' && data.sessionId) {
                await handleCancelSearch(data.sessionId);
                return;
            }

            ws.send(JSON.stringify({ type: 'ack', received: data }));
        },

        close(ws) {
            // Only remove socket from map; do NOT set user to IDLE (refresh/nav keeps them searching)
            for (const [sessionId, socket] of searchingSockets) {
                if (socket === ws) {
                    searchingSockets.delete(sessionId);
                    searchingDeckIds.delete(sessionId);
                    console.log('Socket removed from queue (disconnect/refresh)');
                    break;
                }
            }
        }
    }
});

async function clearSearchingState(sessionId: string) {
    const user = await prisma.user.findUnique({
        where: { sessionID: sessionId },
        select: { id: true }
    });
    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { GameState: 'IDLE' }
        });
    }
}

async function handleFindGame(ws: ServerWebSocket<unknown>, sessionId: string, deckId: number) {
    console.log('handleFindGame', sessionId);
    const user = await prisma.user.findUnique({
        where: { sessionID: sessionId },
        select: { id: true, userName: true }
    });

    if (!user) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid session' }));
        return;
    }

    // 1. Set this user to SEARCHING in DB (frontend can show "searching" from layout/load)
    await prisma.user.update({
        where: { id: user.id },
        data: { GameState: 'SEARCHING' }
    });

    // 2. Keep their socket and selected deck so we can push match_found and write Game
    searchingSockets.set(sessionId, ws);
    searchingDeckIds.set(sessionId, deckId);

    // 3. Find an opponent by DB state (another user with SEARCHING, not self)
    const opponent = await prisma.user.findFirst({
        where: {
            GameState: 'SEARCHING',
            id: { not: user.id }
        },
        select: { id: true, userName: true, sessionID: true }
    });

    if (!opponent) {
        ws.send(JSON.stringify({ type: 'searching' }));
        console.log(`${user.userName} is now searching (DB: SEARCHING)`);
        return;
    }

    // 4. Get opponent's socket (they must be connected to this server)
    const opponentWs = searchingSockets.get(opponent.sessionID);
    if (!opponentWs || opponentWs.readyState !== 1) {
        // Opponent disconnected or not on this instance; clear their stale state
        await prisma.user.update({
            where: { id: opponent.id },
            data: { GameState: 'IDLE' }
        });
        ws.send(JSON.stringify({ type: 'searching' }));
        console.log(`${user.userName} searching; opponent ${opponent.userName} no longer connected`);
        return;
    }

    // 5. Create single game record (match + in-match state); set both users to IN_BATTLE
    const player1DeckId = searchingDeckIds.get(opponent.sessionID) ?? null;
    const player2DeckId = deckId || null;
    const game = await prisma.game.create({
        data: {
            player1Id: opponent.id,
            player2Id: user.id,
            player1DeckId: player1DeckId,
            player2DeckId: player2DeckId,
            status: 'IN_PROGRESS',
            currentTurn: 1,
            player1Health: 20,
            player2Health: 20,
            player1MaxHealth: 20,
            player2MaxHealth: 20,
        }
    });

    await prisma.user.updateMany({
        where: { id: { in: [opponent.id, user.id] } },
        data: { GameState: 'IN_BATTLE', currentGameId: game.id }
    });

    // 6. Remove both from local socket and deck maps
    searchingSockets.delete(opponent.sessionID);
    searchingSockets.delete(sessionId);
    searchingDeckIds.delete(opponent.sessionID);
    searchingDeckIds.delete(sessionId);

    // 7. Notify both (frontend will navigate to game; layout will see IN_BATTLE on next load)
    const matchFound = (opponentName: string, opponentId: number) =>
        JSON.stringify({ type: 'match_found', gameId: game.id, opponentId, opponentName });

    opponentWs.send(matchFound(user.userName, user.id));
    ws.send(matchFound(opponent.userName, opponent.id));

    console.log(`Match created: ${opponent.userName} vs ${user.userName} (Game: ${game.id})`);
}

async function handleCancelSearch(sessionId: string) {
    searchingSockets.delete(sessionId);
    searchingDeckIds.delete(sessionId);
    await clearSearchingState(sessionId);
    console.log('Search cancelled');
}

console.log(`WebSocket server running on ws://localhost:${server.port}/ws`);
