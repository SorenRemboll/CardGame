import { goto } from "$app/navigation";
import { ROUTES } from "$lib/consts/routes";
import type { GameState } from "@prisma-app/client";

class User {
    private _id: number = $state(0);

    private _isAuthenticated: boolean = $state(false);
    
    public userName:string = $state("");

    gameState:GameState = $state("IDLE");


    async searchGame(){
        this.gameState = "SEARCHING";
        const response = await fetch('/api/user/search-for-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

        });
        if(!response.ok){
            console.error("Failed to set user state");
            this.gameState = "IDLE";
            return;
        }
        const results = await response.json();
        if(results.state){
            this.gameState = results.state;
            goto(ROUTES.LOADING)
        }
    }
    async cancelSearch(){
        this.gameState = "IDLE";
        const response = await fetch('/api/user/cancel-search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if(!response.ok){
            console.error("Failed to set user state");
            this.gameState = "SEARCHING";
            return;
        }
        const results = await response.json();
        if(results.state){
            this.gameState = results.state;
            goto(ROUTES.HOME);
        }
    }
    get id() {
        return this._id;
    }
    set id(value: number) {
        if(this._id) return
        this._id = value;
    }
    get isAuthenticated() {
        return this._isAuthenticated;
    }
    set isAuthenticated(value: boolean) {
        if(this._isAuthenticated) return
        this._isAuthenticated = value;
    }
    async logout(){
        
        if(!this._isAuthenticated) return
        
        const results = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if(results.ok) {
            this._id = 0;
            this._isAuthenticated = false;
            this.userName = "";
            goto(ROUTES.LOGIN);
        }
    }
}
export const user = new User();