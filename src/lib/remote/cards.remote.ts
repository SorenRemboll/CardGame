import { query, getRequestEvent } from '$app/server';
import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

/** Validation schema for getCards input. Optional; when omitted, all cards are returned. */
const getCardsInputSchema = z
    .object({
        cardIds: z.array(z.number().int().positive()).default([])
    })
    .optional();

type GetCardsInput = z.infer<typeof getCardsInputSchema>;

export const getCards = query(getCardsInputSchema, async (input?: GetCardsInput) => {
    const event = getRequestEvent();
    const user = event.locals.user;

    if (!user) {
        error(401, 'User not authenticated');
    }

    const parsed = getCardsInputSchema.safeParse(input);
    if (!parsed.success) {
        error(400, parsed.error.issues[0].message);
    }

    const { cardIds = [] } = parsed.data ?? {};

    const cards = cardIds.length === 0
        ? await prisma.cardData.findMany({
            omit: { time_created: true, time_updated: true },
            orderBy: { spirit_cost: 'asc' }
        })
        : await prisma.cardData.findMany({
            omit: { time_created: true, time_updated: true },
            where: { id: { in: cardIds } }
        });

    return { success: true, cards };
});
