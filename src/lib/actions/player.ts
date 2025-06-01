import { boardState } from "$lib/state/Board.state.svelte";
import { enemyPlayerState } from "$lib/state/Player.state.svelte";
import type { Card } from "$lib/types/Game";

export const playCard = (card:Card) => {
    enemyPlayerState.takeDamage(card.attack)
}

