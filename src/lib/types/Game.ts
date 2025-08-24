import type { Deck, CardMetaData } from '@prisma-app/client';
export namespace Game {
    export type DeckWithCards = {
        cards: CardMetaData[]
        description: string
        name: string
    }
}