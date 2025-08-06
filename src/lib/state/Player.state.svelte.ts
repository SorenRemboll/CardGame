import { DECK_SLOTS_CAP_AMOUNT } from "$lib/consts/User.consts";
import type { Game } from "$lib/types/Game";
export class PlayerState {
    //Player state and storage
    private _decks:Game.DeckWithCards[] = $state([]);
    get decks() {
        return this._decks;
    }
    isAllDecksSlotsTaken = $derived(this._decks.length === DECK_SLOTS_CAP_AMOUNT)
   
}
export const playerState = new PlayerState();