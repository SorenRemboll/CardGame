import { goto } from "$app/navigation";
import { ROUTES } from "$lib/consts/routes";
import { createWSClient } from "$lib/shared/ws-client";
import { user } from "./User.state.svelte";

class ConnectionState {
    client = createWSClient('ws://localhost:8888/ws');
    isConnected = $state(false);

    async connect() {
        if (this.isConnected) return;

        // Set up handlers before connecting
        this.client.on('connected', () => {
            console.log('WebSocket connected');
        });

        this.client.on('searching', () => {
            console.log('Added to search queue');
            user.gameState = 'SEARCHING';
        });

        this.client.on('match_found', (msg) => {
            console.log('Match found!', msg);
            user.gameState = 'IN_BATTLE';
            user.currentGameId = msg.gameId;
            user.opponentName = msg.opponentName;
            goto(ROUTES.GAME);
        });

        this.client.on('error', (msg) => {
            console.error('Server error:', msg.message);
        });

        await this.client.connect();
        this.isConnected = true;
    }

    disconnect() {
        this.client.disconnect();
        this.isConnected = false;
    }

    findGame(sessionId: string, deckId?: number) {
        this.client.send({ type: 'find_game', sessionId, deckId: deckId ?? 0 });
    }

    cancelSearch(sessionId: string) {
        this.client.send({ type: 'cancel_search', sessionId });
    }
}

export const connectionState = new ConnectionState();
