<script lang="ts">
    import { ROUTES } from "$lib/consts/routes";
    import { playerState } from "$lib/state/Player.state.svelte";
</script>

{#if !playerState.isAllDecksSlotsTaken}
    <a href={ROUTES.CHARACTER_DECK('new-deck')} class=""> 
        Create new deck
    </a>
{:else}
    <p class="text-red-500">You have reached the maximum number of decks.</p>
{/if}
<div class="flex flex-wrap overflow-scroll gap-2 p-4">
    {#each playerState.decks as deck}
        <a href={ROUTES.CHARACTER_DECK(deck.id)} class="block w-1/3 h-fit">
            <div class="border p-2 hover:bg-white/10 transition rounded">
                <h3 class="text-lg font-bold">{deck.name}</h3>
                <p class="text-sm">Description: {deck.description}</p>
                <p class="text-sm">Cards: {deck.cards.length}</p>
            </div>
        </a>
    {/each}
</div>
{#if playerState.isAllDecksSlotsTaken}
    <p class="text-red-500">You have reached the maximum number of decks.</p>
{:else}
    <p class="text-green-500">You can create more decks.</p>
{/if}
