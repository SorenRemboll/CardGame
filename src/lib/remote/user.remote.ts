import { query, getRequestEvent } from '$app/server';
import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';

export const cancelSearch = query(async () => {
    const event = getRequestEvent();
    const user = event.locals.user;

    if (!user) {
        error(401, 'User not authenticated');
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { GameState: 'IDLE' }
    });

    return {
        success: true,
        state: updatedUser.GameState
    };
});
