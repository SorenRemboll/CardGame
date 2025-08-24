import { DECK_SLOTS_CAP_AMOUNT } from "$lib/consts/User.consts";
import type { Game } from "$lib/types/Game";
import type {Deck} from "@prisma-app/client";
export class PlayerState {
    //Player state and storage
    private _decks:Deck[] = $state([]);
    get decks() {
        return this._decks;
    }
    async createDeck(deck: {
        name: string;
        description: string;
        cards: number[]; // Array of card IDs
    }) {
        if (this._decks.length >= DECK_SLOTS_CAP_AMOUNT) {
            throw new Error("Deck slots are full");
        }
        const response = await fetch("/api/decks/create-deck", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(deck)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create deck");
        }
        const reponse = await response.json();
        if(response.ok) {
            this._decks.push(reponse.deck);
        }
        return ;
    }
    setDecks(decks:Deck[]){
        this._decks = decks;
    }
    isAllDecksSlotsTaken = $derived(this._decks.length === DECK_SLOTS_CAP_AMOUNT)
   
}
export const playerState = new PlayerState();