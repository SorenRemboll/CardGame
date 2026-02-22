import { query, getRequestEvent } from '$app/server';
import { DECK_DESCRIPTION_MAX_LENGTH, DECK_SLOTS_CAP_AMOUNT } from '$lib/consts/User.consts';
import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

const DeckCardSchema = z.object({
    cardId: z.number().int().positive(),
    quantity: z.number().int().min(1).max(4)
});

/** Validation schema for saveDeck input. */
 const saveDeckInputSchema = z.object({
    id: z.number().int().optional(),
    name: z.string().min(1, 'Deck name is required').max(50, 'Deck name too long'),
    description: z.string().max(DECK_DESCRIPTION_MAX_LENGTH, 'Description too long').optional().default(''),
    cards: z.array(DeckCardSchema).refine(
        (cards) => {
            const total = cards.reduce((sum, c) => sum + c.quantity, 0);
            return total >= 1 && total <= 30;
        },
        { message: 'Deck must contain between 1 and 30 cards' }
    )
});

type SaveDeckInput = z.infer<typeof saveDeckInputSchema>;

export const saveDeck = query(saveDeckInputSchema, async (input: SaveDeckInput) => {
    const event = getRequestEvent();
    const user = event.locals.user;

    if (!user) {
        error(401, 'User not authenticated');
    }

    const parsed = saveDeckInputSchema.safeParse(input);
    if (!parsed.success) {
        error(400, parsed.error.issues[0].message);
    }

    const { id, name, description, cards } = parsed.data;

    // Check deck slot limit for new decks
    if (!id) {
        const deckCount = await prisma.deck.count({
            where: { userId: user.id }
        });

        if (deckCount >= DECK_SLOTS_CAP_AMOUNT) {
            error(400, 'Deck slots are full');
        }
    }

    let deck;

    if (id && id > 0) {
        // Verify ownership
        const existingDeck = await prisma.deck.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existingDeck || existingDeck.userId !== user.id) {
            error(403, 'Not authorized to edit this deck');
        }

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
                deckCards: { include: { card: true } }
            }
        });
    } else {
        deck = await prisma.deck.create({
            data: {
                name,
                description,
                userId: user.id,
                deckCards: {
                    create: cards.map(c => ({
                        cardId: c.cardId,
                        quantity: c.quantity
                    }))
                }
            },
            include: {
                deckCards: { include: { card: true } }
            }
        });
    }

    const formattedCards = deck.deckCards.map(dc => ({
        ...dc.card,
        quantity: dc.quantity
    }));

    return {
        success: true,
        deck: {
            id: deck.id,
            name: deck.name,
            description: deck.description ?? '',
            cards: formattedCards
        }
    };
});

/** Validation schema for deleteDeck input. */
 const deleteDeckInputSchema = z.object({
    id: z.number().int().positive()
});

type DeleteDeckInput = z.infer<typeof deleteDeckInputSchema>;

export const deleteDeck = query(deleteDeckInputSchema, async (input: DeleteDeckInput) => {
    const event = getRequestEvent();
    const user = event.locals.user;

    if (!user) {
        error(401, 'User not authenticated');
    }

    const parsed = deleteDeckInputSchema.safeParse(input);
    if (!parsed.success) {
        error(400, parsed.error.issues[0].message);
    }

    const { id } = parsed.data;

    const deck = await prisma.deck.findUnique({
        where: { id },
        select: { userId: true }
    });

    if (!deck || deck.userId !== user.id) {
        error(403, 'Not authorized to delete this deck');
    }

    await prisma.deck.delete({
        where: { id }
    });

    return { success: true };
});
