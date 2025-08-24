import { redirect } from "@sveltejs/kit";
import { DBClient } from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({locals}) => {
	if(!locals.user){
        redirect(307, '/login');
    }
    const decks = await DBClient.deck.findMany({
        where:{
            userId: locals.user.id,
        },
    });
   if(!decks || decks.length === 0) {
        return {
            decks: [],
			user: locals.user
        };
    }    
    return {
		user: locals.user,
        decks: decks,
    };
};