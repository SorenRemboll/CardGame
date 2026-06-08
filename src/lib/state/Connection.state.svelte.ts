import { goto } from "$app/navigation";
import { ROUTES } from "$lib/consts/routes";
import { createWSClient } from "$lib/shared/ws-client";
import { gameState } from "./Game.state.svelte";
import { user } from "./User.state.svelte";

class ConnectionState {
    client = createWSClient('ws://localhost:8888/ws');
    isConnected = $state(false);

    /** Session ID lives only here; fetched from API when needed. */
    private _sessionId = '';

    async connect() {
        if (this.isConnected) return;

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
            goto(ROUTES.GAME);
        });

        this.client.on('error', (msg) => {
            console.error('Server error:', msg.message);
        });

        this.client.on('message_received', (msg) => {
            console.log('Message received:', msg.message);
            console.log(msg.message);

            gameState.onReceiveMessage(msg.message);
        });

        const sessionId = await this.ensureSessionId();
        if (!sessionId) return;
        await this.client.connect(sessionId);
        this.isConnected = true;
    }

    disconnect() {
        this.client.disconnect();
        this.isConnected = false;
        this._sessionId = '';
    }

    /** Fetches sessionId from API (cookie) and caches it. Returns null if not authenticated. */
    private async ensureSessionId(): Promise<string | null> {
        if (this._sessionId) return this._sessionId;
        const res = await fetch('/api/session');

        if (!res.ok) return null;
        const data = await res.json() as { sessionId: string | null };
        if (data.sessionId) this._sessionId = data.sessionId;
        return data.sessionId;
    }

    async findGame(deckId?: number): Promise<boolean> {
        if (!this.isConnected) return false;
        this.client.send({ type: 'find_game', deckId: deckId ?? 0 });
        return true;
    }

    async cancelSearch(): Promise<boolean> {
        if (!this.isConnected) return false;
        this.client.send({ type: 'cancel_search' });
        return true;
    }

    async sendMessage(message: string): Promise<boolean> {
        if (!this.isConnected) return false;
        this.client.send({ type: 'send_message', message });
        return true;
    }
}
export const connectionState = new ConnectionState();