import type { Card } from "$lib/data/cards/Card.data.svelte";
import { DECK_SLOTS_CAP_AMOUNT } from "$lib/consts/User.consts";
import type { Game } from "$lib/types/Game";
export class PlayerState {
    //Player state and storage
    private _decks:Game.DeckWithCards[] = $state([]);
    get decks() {
        return this._decks;
    }
    setDeck(deck:Game.DeckWithCards){
        const index = this._decks.findIndex(d => d.id === deck.id);
        if(index !== -1){
            this._decks[index] = deck;
        } else {
            this._decks.push(deck);
        }
    }
    setDecks(decks:Game.DeckWithCards[]){
        this._decks = decks;
    }
    isAllDecksSlotsTaken = $derived(this._decks.length === DECK_SLOTS_CAP_AMOUNT)
   
}
export const playerState = new PlayerState();