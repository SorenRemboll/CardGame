<script lang="ts">
    import { getCards } from "$lib/actions/Cards/Cards.actions";
    import {Card} from "$lib/cards/BaseCard"
    import DisplayCard from "$lib/components/DisplayCard.svelte";
    
    import { DECK_DESCRIPTION_MAX_LENGTH, DECK_SIZE } from "$lib/consts/User.consts";
    import { playerState } from "$lib/state/Player.state.svelte";
    import { onMount } from "svelte";

    let isCreatingNewDeck = $state(false);
    let newDeckName = $state("");
    let newDeckDescription = $state("");
    let newDeckCards:Card[] = $state([]);
    let formattedNewDeckCards = $derived(
        newDeckCards.reduce((acc:Record<string,{
            card: Card,
            count: number
        }>, card) => {
            if(acc[card.id]) {
                acc[card.id].count += 1;
            } else {
                acc[card.id] = { card, count: 1 };
            }
            return acc;
        }, {})
    );
    let cards = $state<Card[]>([]);
    onMount(async() => {
        cards = await getCards()
    });
    const addCardToDeck = (card: Card) => {
         if(newDeckCards.length === DECK_SIZE) {
            alert("Deck is full, you can only have " + DECK_SIZE + " cards in a deck.");
            return;
        }
        if(newDeckCards.filter(c => c.id === card.id).length === 2) {
            alert("You already have this card in your deck twice.");
            return;
        }
        newDeckCards.push(card);
    };
</script>




{#if isCreatingNewDeck}
<div class=" min-h-28 w-full flex flex-col overflow-scroll">
    <h1>Creating new deck: <input class="bg-transparent border-b-2 border-x-0 border-t-0 border-black focus:outline-hidden focus:outline-0" type="text"  bind:value={newDeckName}></h1>
    <p>Description {newDeckDescription.length} / {DECK_DESCRIPTION_MAX_LENGTH} </p>
    <input id="desc" class="bg-transparent w-52 border-b-2 border-x-0 border-t-0 border-black focus:outline-hidden focus:outline-0" oninput={(e) => {
    if(newDeckDescription.length >= DECK_DESCRIPTION_MAX_LENGTH) {
        newDeckDescription = newDeckDescription.slice(0, DECK_DESCRIPTION_MAX_LENGTH);
    }}} type="text" bind:value={newDeckDescription}>
</div>
   <div class="grow flex flex-row overflow-hidden">
     <div class=" grow grid grid-cols-5 shadow-[0px_0px_44px_4px_rgba(0,0,0,0.75)_inset] bg-slate-700 gap-10 overflow-y-scroll p-4">
        {#each cards as card }
            <DisplayCard {card} onclick={() => {
                addCardToDeck(card)           
            }} />
        {/each}
    </div>
    <div class="w-1/5 border bg-gray-800 border-black/50 shadow flex flex-col ">
        <p class="p-2">Deck: {newDeckCards.length} / {DECK_SIZE}</p>

        <div class="grow overflow-y-scroll">
             {#each Object.values(formattedNewDeckCards) as deckEntry}
            <div class="odd:bg-black/10 w-full flex flex-row items-center gap-2 p-2">
                <span class=" p-2 w-3 h-3 bg-white/10 rounded-full inline-flex items-center justify-center">{deckEntry.card.spirit_cost}</span> <span class="grow  truncate">{deckEntry.card.name}</span> <span>{deckEntry.count}</span>
            </div>
        {/each}
        </div>
        <div class="p-2">
            <button class="w-full transition cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick={async() => {
                if(newDeckName.length === 0) {
                    alert("Please enter a name for your deck.");
                    return;
                }
                if(newDeckDescription.length > DECK_DESCRIPTION_MAX_LENGTH) {
                    alert("Description is too long, maximum is " + DECK_DESCRIPTION_MAX_LENGTH + " characters.");
                    return;
                }
                if(newDeckCards.length < 1) {
                    alert("You need to add at least one card to your deck.");
                    return;
                }
                await playerState.createDeck({
                    name: newDeckName,
                    description: newDeckDescription,
                    cards: newDeckCards.map(card => card.id)
                });
                isCreatingNewDeck = false;
            }}>Create Deck</button>
        </div>
    </div>
   
   </div>
    
{:else}
{#if !playerState.isAllDecksSlotsTaken}
    <button onclick={() => {
        isCreatingNewDeck = true;
    }}>Create new deck</button>
{/if}
    <div class="flex flex-col flex-wrap overflow-scroll gap-2 p-4">
        {#each playerState.decks as deck}
            <div class="border w-1/3 p-2">
                <h3 class="text-lg font-bold">{deck.name}</h3>
                <p class="text-sm">Description: {deck.description}</p>
                <p class="text-sm">Cards: {deck.cards.length}</p>
            </div>
        {/each}
        
    </div>
    {#if playerState.isAllDecksSlotsTaken}
            <p class="text-red-500">You have reached the maximum number of decks.</p>
        {:else}
            <p class="text-green-500">You can create more decks.</p>
        {/if}
{/if}


