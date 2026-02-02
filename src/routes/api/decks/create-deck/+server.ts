import { DECK_SLOTS_CAP_AMOUNT } from "$lib/consts/User.consts";
import { prisma } from "$lib/prisma";
import type { Game } from "$lib/types/Game";
import { error, json, type RequestHandler } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request, locals }) => {
    const { name, description, cards, id }: { name: string, description: string, cards: { cardId: number, quantity: number }[], id: number } = await request.json();
    if (!locals.user) {
        return json({
            success: false,
            message: "User not authenticated"
        }, { status: 401 });
    }
    if (!name) {
        return json({
            success: false,
            message: "Deck name is required"
        }, { status: 400 });
    }
    if (!description) {
        return json({
            success: false,
            message: "Deck description is required"
        }, { status: 400 });
    }
    const totalCards = cards.reduce((sum, c) => sum + c.quantity, 0);
    if (totalCards === 0 || totalCards > 30) {
        return json({
            success: false,
            message: "Deck must contain between 1 and 30 cards"
        }, { status: 400 });
    }
    const isUserAllowedToCreateDeck = await prisma.deck.count({
        where: {
            userId: locals.user.id,
        }
    }) <= DECK_SLOTS_CAP_AMOUNT;
    if (!isUserAllowedToCreateDeck) {
        return json({
            success: false,
            message: "Deck slots are full"
        }, { status: 400 });
    }
    try {
        let deck;
        if (id && id > 0) {
            // Update existing deck - first delete old cards, then add new ones
            await prisma.deckCard.deleteMany({
                where: { deckId: id }
            });

            deck = await prisma.deck.update({
                where: { id },
                data: {
                    name,
                    description,
                    deckCards: {
                        create: cards.map(c => ({
                            cardId: c.cardId,
                            quantity: c.quantity
                        }))
                    }
                },
                include: {
                    deckCards: {
                        include: { card: true }
                    }
                }
            });
        } else {
            deck = await prisma.deck.create({
                data: {
                    name,
                    description,
                    userId: locals.user.id,
                    deckCards: {
                        create: cards.map(c => ({
                            cardId: c.cardId,
                            quantity: c.quantity
                        }))
                    }
                },
                include: {
                    deckCards: {
                        include: { card: true }
                    }
                }
            });
        }

        if (!deck) {
            return json({
                success: false,
                message: "Failed to create deck"
            }, { status: 500 });
        }

        // Format response to flatten cards with quantity
        const formattedCards = deck.deckCards.map(dc => ({
            ...dc.card,
            quantity: dc.quantity
        }));

        return json({
            success: true,
            deck: {
                id: deck.id,
                name: deck.name,
                description: deck.description,
                cards: formattedCards
            }
        });
    } catch (e) {
        console.error(e);
        return error(500, {
            message: "Failed to create deck"
        });
    }
};