import type { ServerWebSocket } from 'bun';
import { prisma } from './prisma';

// Map sessionId -> WebSocket for active connections that are searching
// DB is source of truth for GameState (SEARCHING); map only for sending messages
type WSData = { sessionId: string | null };
const searchingSockets = new Map<string, ServerWebSocket<WSData>>();
// Map sessionId -> deckId selected when queuing (so we can store it on the Game when matched)
const searchingDeckIds = new Map<string, number>();

const server = Bun.serve<WSData>({
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
            const sessionId = url.searchParams.get('sessionId') ?? null;
            const upgraded = server.upgrade(req, { data: { sessionId } });
            if (upgraded) return undefined;
            return new Response('WebSocket upgrade failed', { status: 400 });
        }

        return new Response('WebSocket Server OK');
    },

    websocket: {
        data: {} as WSData,
        async open(ws) {
            const sessionId = ws.data.sessionId;
            if (!sessionId) {
                ws.send(JSON.stringify({ type: 'error', message: 'Missing session' }));
                ws.close();
                return;
            }
            const user = await prisma.user.findUnique({
                where: { sessionID: sessionId },
                select: { id: true, userName: true, currentGameId: true }
            });
            if (!user) {
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid session' }));
                ws.close();
                return;
            }
            if (user.currentGameId) {
                await handleConnect(ws, sessionId);
            } else {
                ws.send(JSON.stringify({ type: 'connected' }));
            }
        },

        async message(ws, message) {
            const data = JSON.parse(message.toString());
            const sessionId = ws.data.sessionId;

            if (data.type === 'find_game' && typeof data.deckId === 'number' && sessionId) {
                await handleFindGame(ws, sessionId, data.deckId);
                return;
            }

            if (data.type === 'send_message' && data.message && sessionId) {
                await handleSendMessage(ws, sessionId, data.message);
                return;
            }

            if (data.type === 'cancel_search' && sessionId) {
                await handleCancelSearch(sessionId);
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

async function handleConnect(ws: ServerWebSocket<WSData>, sessionId: string) {
    const user = await prisma.user.findUnique({
        where: { sessionID: sessionId },
        select: { id: true, userName: true, currentGameId: true }
    });
    if (!user) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid session' }));
        return;
    }
    if (!user.currentGameId) {
        ws.send(JSON.stringify({ type: 'error', message: 'No game found' }));
        return;
    }
    const gameDeckIds = await prisma.game.findUnique({
        where: { id: user?.currentGameId },
        select: { attackerId: true, defenderId: true, attackerDeckId: true, defenderDeckId: true }
    });
    const userDeckId = gameDeckIds?.attackerId === user.id ? gameDeckIds?.attackerDeckId : gameDeckIds?.defenderDeckId;
    searchingSockets.set(sessionId, ws);
    searchingDeckIds.set(sessionId, userDeckId!);
    ws.send(JSON.stringify({ type: 'connected', gameId: user.currentGameId }));
    console.log('user connected', user.userName);
}

async function handleFindGame(ws: ServerWebSocket<WSData>, sessionId: string, deckId: number) {
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
    const attackerDeckId = searchingDeckIds.get(opponent.sessionID) ?? null;
    const defenderDeckId = deckId || null;
    const game = await prisma.game.create({
        data: {
            attackerId: opponent.id,
            defenderId: user.id,
            attackerDeckId,
            defenderDeckId,
            status: 'IN_PROGRESS',
            currentTurn: 1,
            attackerHealth: 20,
            defenderHealth: 20,
            attackerMaxHealth: 20,
            defenderMaxHealth: 20,
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

async function handleSendMessage(ws: ServerWebSocket<WSData>, sessionId: string, message: string) {
    const user = await prisma.user.findUnique({
        where: { sessionID: sessionId },
        select: { id: true, userName: true, currentGameId: true }
    });
    if (!user) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid session' }));
        return;
    }
    if (!user.currentGameId) {
        ws.send(JSON.stringify({ type: 'error', message: 'No game found' }));
        return;
    }
    const opponent = await prisma.user.findFirst({
        where: {
            currentGameId: user.currentGameId,
            id: { not: user.id }
        },
        select: { id: true, userName: true, sessionID: true, currentGameId: true }
    });

    if (!opponent) {
        ws.send(JSON.stringify({ type: 'error', message: 'Opponent not found' }));
        return;
    }
    const opponentWs = searchingSockets.get(opponent.sessionID);
    if (!opponentWs || opponentWs.readyState !== 1) {
        ws.send(JSON.stringify({ type: 'error', message: 'Opponent not found' }));
        return;
    }
    const addedMessage = await prisma.message.create({
        data: {
            userName: user.userName,
            content: message,
            gameId: user.currentGameId,
            userId: user.id
        },
        select: { id: true, content: true, userName: true, userId: true, time_created: true }
    });
    opponentWs.send(JSON.stringify({ type: 'message_received', message: addedMessage }));
}

console.log(`WebSocket server running on ws://localhost:${server.port}/ws`);
