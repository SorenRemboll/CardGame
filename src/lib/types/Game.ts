import type { Card } from '$lib/data/cards/Card.data.svelte';
export namespace Game {
    export type DeckWithCards = {
        id:number,
        cards: Card[]
        description: string
        name: string
    }
}