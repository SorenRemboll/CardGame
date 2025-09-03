import { DBClient } from "$lib/prisma";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({locals}) => {
	if(locals.user){
		const decks = await DBClient.deck.findMany({
			where:{
				userId: locals.user.id,
			},
			include:{
				cards: true,
			}
		});
		if(!decks || decks.length === 0) {
			return {
				decks: [],
				user: locals.user
			};
		}
		const formattedDecks = decks.map((deck) => ({
			id: deck.id,
			name: deck.name,
			description: deck.description,
			cards: deck.cards
		}));
		return {
			decks:formattedDecks,
			user: locals.user
		};
	}
    return {
		user: locals.user,
    };
};