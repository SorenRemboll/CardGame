import { Card } from "$lib/data/cards/Card.data.svelte";
import { getCards as serverGetCards } from "$lib/remote/cards.remote";

/**
 * @description Fetches cards from the server based on the provided card IDs.
 * if no IDs are provided, it fetches all cards.
 */
export const getCards = async (cardIds: number[] = []): Promise<Card[]> => {
    const result = await serverGetCards({ cardIds });
    return result.cards.map((cardData) => new Card(cardData));
};
