import { ROUTES } from '$lib/consts/routes';
import { gameState } from '$lib/state/Game.state.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
export const load: PageLoad = () => {
	if(!gameState.gameId){
        redirect(307, ROUTES.CHARACTER);
    }
};