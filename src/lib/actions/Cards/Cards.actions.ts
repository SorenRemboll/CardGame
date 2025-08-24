import { Card } from "$lib/cards/BaseCard";

/**
 * @description Fetches cards from the server based on the provided card IDs.
 * if no IDs are provided, it fetches all cards.
 */
export const getCards = async (card_ids:number[] = []) : Promise<Card[]> => {
    const response = await fetch("/api/cards/get-cards", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ card_ids })
    });

    if (!response.ok) {
        throw new Error("Failed to fetch cards");
    }
    const rawCards = await response.json() as {
        cards:Card[],
        success:boolean,
    };
    const cards:Card[] = rawCards.cards.map((cardData) => new Card(cardData));
    return cards;
}