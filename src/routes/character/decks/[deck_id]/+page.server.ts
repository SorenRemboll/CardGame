import { DBClient } from "$lib/prisma";
import type { PageServerLoad } from "./$types";

export const load:PageServerLoad = async({params,locals}) => {
    if(params.deck_id === 'new-deck' || isNaN(parseInt(params.deck_id)) || !locals.user) {
        return {}
    }
    const deck_id = parseInt(params.deck_id);
    const deck = await DBClient.deck.findUnique({
        where: {
            id: deck_id,
            userId: locals.user.id
        },
        include: {
            cards: true
        }
    });
    if(!deck) {
        return {}
    };
    return {
        deck
    };

}