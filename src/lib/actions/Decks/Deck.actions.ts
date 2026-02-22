import type { Deck } from '$lib/data/decks/Deck.data.svelte';
import { DECK_SLOTS_CAP_AMOUNT } from '$lib/consts/User.consts';
import { playerState } from '$lib/state/Player.state.svelte';

export const createOrUpdateDeck = async (deck: Deck, toUpdate = false) => {
        if (playerState.decks.length >= DECK_SLOTS_CAP_AMOUNT) {
            throw new Error("Deck slots are full");
        }
        const url = toUpdate ? `/api/decks/update-deck/${deck.id}` : "/api/decks/create-deck";
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
            playerState.decks.push(reponse.deck);
        }
        return ;
    }