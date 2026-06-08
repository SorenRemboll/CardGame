import { goto } from "$app/navigation";
import { ROUTES } from "$lib/consts/routes";
import type { GameState } from "@prisma-app/client";
import { connectionState } from "./Connection.state.svelte";
import { cancelSearch } from "$lib/remote/user.remote";

class User {
    private _id: number = $state(0);
    private _isAuthenticated: boolean = $state(false);

    public userName: string = $state("");
    gameState: GameState = $state("IDLE");

    async searchGame(deckId: number) {
        if (!this._isAuthenticated) {
            console.error("Not authenticated");
            return;
        }
        await connectionState.connect();
        const ok = await connectionState.findGame(deckId);
        if (!ok) return;
        goto(ROUTES.LOADING);
    }

    async cancelSearch() {
        const ok = await connectionState.cancelSearch();
        if (!ok) return;
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
        connectionState.disconnect();
        this._id = 0;
        this._isAuthenticated = false;
        this.userName = "";
        goto(ROUTES.LOGIN);
    }
}

export const user = new User();
