<script lang="ts">
    import { getCards } from "$lib/actions/Cards/Cards.actions";
    import {Card} from "$lib/cards/BaseCard"
    import { DECK_DESCRIPTION_MAX_LENGTH } from "$lib/consts/User.consts";
    import { playerState } from "$lib/state/Player.state.svelte";
    import { onMount } from "svelte";

    let isCreatingNewDeck = $state(true);
    let newDeckName = $state("");
    let newDeckDescription = $state("");
    let newDeckCards:Card[] = $state([]);
    let cards = $state<Card[]>([]);
    onMount(async() => {
        cards = await getCards()
        
    });
</script>



{#if isCreatingNewDeck}
<h1>Creating new deck: <input class="bg-transparent border-b-2 border-x-0 border-t-0 border-black focus:outline-hidden focus:outline-0" type="text"  bind:value={newDeckName}></h1>
<p>Description {newDeckDescription.length} / {DECK_DESCRIPTION_MAX_LENGTH} </p>
<input class="bg-transparent border-b-2 border-x-0 border-t-0 border-black focus:outline-hidden focus:outline-0" oninput={(e) => {
    if(newDeckDescription.length >= DECK_DESCRIPTION_MAX_LENGTH) {
        newDeckDescription = newDeckDescription.slice(0, DECK_DESCRIPTION_MAX_LENGTH);
    }
}} type="text" bind:value={newDeckDescription}>
    <div class="cardContainer">

    </div>
{:else}
{#if !playerState.isAllDecksSlotsTaken}
    <button onclick={() => {
        isCreatingNewDeck = true;
    }}>Create new deck</button>
{/if}
    <div class="">
        {#each playerState.decks as deck}
            <div class="border p-2 m-2">
                <h3 class="text-lg font-bold">{deck.name}</h3>
                <p class="text-sm">Description: {deck.description}</p>
                <p class="text-sm">Cards: {deck.cards.length}</p>
            </div>
        {/each}
        {#if playerState.isAllDecksSlotsTaken}
            <p class="text-red-500">You have reached the maximum number of decks.</p>
        {:else}
            <p class="text-green-500">You can create more decks.</p>
        {/if}
    </div>
{/if}

