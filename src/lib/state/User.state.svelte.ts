import { goto } from "$app/navigation";
import { ROUTES } from "$lib/consts/routes";
import type { GameState } from "@prisma-app/client";
import { connectionState } from "./Connection.state.svelte";
import { cancelSearch } from "$lib/remote/user.remote";

class User {
    private _id: number = $state(0);
    private _isAuthenticated: boolean = $state(false);
    private _sessionId: string = $state("");

    public userName: string = $state("");
    gameState: GameState = $state("IDLE");
    currentGameId: string | null = $state(null);
    opponentName: string | null = $state(null);

    async searchGame(deckId: number) {
        if (!this._sessionId) {
            console.error("No session ID");
            return;
        }

        // Connect to WebSocket and find a game
        await connectionState.connect();
        connectionState.findGame(this._sessionId, deckId);

        // Navigate to loading screen (will be redirected when match found)
        goto(ROUTES.LOADING);
    }

    async cancelSearch() {
        if (this._sessionId) {
            connectionState.cancelSearch(this._sessionId);
        }

        // Update server state via remote function
        this.gameState = "IDLE";
        await cancelSearch();

        connectionState.disconnect();
        goto(ROUTES.HOME);
    }

    get id() {
        return this._id;
    }
    set id(value: number) {
        if (this._id) return;
        this._id = value;
    }

    get sessionId() {
        return this._sessionId;
    }
    set sessionId(value: string) {
        if (this._sessionId) return;
        this._sessionId = value;
    }

    get isAuthenticated() {
        return this._isAuthenticated;
    }
    set isAuthenticated(value: boolean) {
        if (this._isAuthenticated) return;
        this._isAuthenticated = value;
    }

    async logout() {
        if (!this._isAuthenticated) return;

        await fetch('/apis/auth', { method: 'POST' });

        this._id = 0;
        this._isAuthenticated = false;
        this._sessionId = "";
        this.userName = "";
        goto(ROUTES.LOGIN);
    }
}

export const user = new User();
