import type { MessageDTO } from '$lib/types/dtos';

// Messages sent from client to server (sessionId is sent in WS URL at connect time)
export type ClientMessage =
    | { type: 'find_game'; deckId: number }
    | { type: 'cancel_search' }
    | { type: 'ping' }
    | { type: 'send_message'; message: string };

// Messages sent from server to client (payloads match what the server actually sends)
export type ServerMessage =
    | { type: 'connected'; gameId?: string }
    | { type: 'searching' }
    | { type: 'match_found'; gameId: string; opponentId: number; opponentName: string }
    | { type: 'error'; message: string }
    | { type: 'pong' }
    | { type: 'message_received'; message: MessageDTO };
