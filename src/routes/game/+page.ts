import { ROUTES } from '$lib/consts/routes';
import { gameState } from '$lib/state/Game.state.svelte';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { user } from '$lib/state/User.state.svelte';
export const load: PageLoad = () => {
    console.log(gameState);
    console.log(user);
    /* if(!gameState.gameId){
        redirect(307, ROUTES.CHARACTER);
    } */
};