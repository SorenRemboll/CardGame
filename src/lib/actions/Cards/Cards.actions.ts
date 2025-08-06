import type { Card } from "$lib/cards/BaseCard";

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

    return await response.json();
}