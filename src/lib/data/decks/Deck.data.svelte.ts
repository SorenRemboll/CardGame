import { goto } from "$app/navigation";
import { ROUTES } from "$lib/consts/routes";
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

    // Get total card count (including duplicates)
    get totalCards() {
        return this.cards.length;
    }

    addCardToDeck = (card: Card) => {
        if (this.cards.length >= DECK_SIZE) {
            alert("Deck is full, you can only have " + DECK_SIZE + " cards in a deck.");
            return;
        }
        if (this.cards.filter(c => c.id === card.id).length >= 2) {
            alert("You already have this card in your deck twice.");
            return;
        }
        this.cards.push(card);
    };

    removeCardFromDeck = (card: Card) => {
        const index = this.cards.findIndex(c => c.id === card.id);
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
    };

    constructor(init: { id?: number; name?: string; description?: string; cards?: Card[] } = {}) {
        this._id = init.id || 0;
        this.name = init.name || "";
        this.description = init.description || "";
        this.cards = init.cards || [];
    }

    // Convert cards array to grouped format for API
    private getCardsForApi() {
        const cardCounts = this.cards.reduce((acc, card) => {
            acc[card.id] = (acc[card.id] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return Object.entries(cardCounts).map(([cardId, quantity]) => ({
            cardId: parseInt(cardId),
            quantity
        }));
    }

    async save() {
        console.log("Saving deck:", this.cards);
        const response = await fetch('/api/decks/create-deck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.id,
                name: this.name,
                description: this.description,
                cards: this.getCardsForApi()
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
        goto(ROUTES.CHARACTER_DECK(responseData.deck.id));
    }
}