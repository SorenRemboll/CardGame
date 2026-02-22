// Messages sent from client to server
export type ClientMessage =
    | { type: 'find_game'; sessionId: string; deckId: number }
    | { type: 'cancel_search'; sessionId: string }
    | { type: 'ping' };

// Messages sent from server to client
export type ServerMessage =
    | { type: 'connected' }
    | { type: 'searching' }
    | { type: 'match_found'; gameId: string; opponentId: number; opponentName: string }
    | { type: 'error'; message: string }
    | { type: 'pong' };
