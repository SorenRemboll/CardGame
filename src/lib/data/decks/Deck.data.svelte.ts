import { DECK_SIZE } from "$lib/consts/User.consts";
import { playerState } from "$lib/state/Player.state.svelte";
import type { Game } from "$lib/types/Game";
import type { Card } from "../cards/Card.data.svelte";

export class Deck {
    private _id: number = $state(0);
    name: string = $state("");
    description: string = $state("");
    cards: Card[] = $state([]);
    get id() {
        return this._id;
    }
    addCardToDeck = (card: Card) => {
         if(this.cards.length === DECK_SIZE) {
            alert("Deck is full, you can only have " + DECK_SIZE + " cards in a deck.");
            return;
        }
        if(this.cards.filter(c => c.id === card.id).length === 2) {
            alert("You already have this card in your deck twice.");
            return;
        }
        this.cards.push(card);
    };
    constructor(init:{ id?: number; name?: string; description?: string; cards?: Card[] } = {}) {
        this._id = init.id || 0;
        this.name = init.name || "";
        this.description = init.description || "";
        this.cards = init.cards || [];
    }
    async save() {
        console.log("Saving deck:", this.cards);
        const response = await fetch('/api/decks/create-deck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id:this.id,
                name: this.name,
                description: this.description,
                cards: this.cards.map(c => c.id)
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            alert("Error saving deck: " + errorData.message);
            return;
        }
        const responseData = await response.json() as { success: boolean; deck: Game.DeckWithCards };
        alert("Deck saved successfully!");
        playerState.setDeck(responseData.deck);
    }
}