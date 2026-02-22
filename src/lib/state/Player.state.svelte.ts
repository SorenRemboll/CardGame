import { DECK_SLOTS_CAP_AMOUNT } from '$lib/consts/User.consts';
import type { Deck } from '$lib/data/decks/Deck.data.svelte';

export class PlayerState {
	private _decks: Deck[] = $state([]);
	get decks() {
		return this._decks;
	}
	setDeck(deck: Deck) {
		const index = this._decks.findIndex((d) => d.id === deck.id);
		if (index !== -1) {
			this._decks[index] = deck;
		} else {
			this._decks.push(deck);
		}
	}
	setDecks(decks: Deck[]) {
		this._decks = decks;
	}
    isAllDecksSlotsTaken = $derived(this._decks.length === DECK_SLOTS_CAP_AMOUNT)
   
}
export const playerState = new PlayerState();