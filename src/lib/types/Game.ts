import type { Deck, Card } from '@prisma-app/client';
export namespace Game {
    export type DeckWithCards = {
        cards: Card[]

    } & Deck
}