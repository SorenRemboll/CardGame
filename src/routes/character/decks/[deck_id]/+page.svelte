<script lang="ts">
    import { getCards } from "$lib/actions/Cards/Cards.actions";
    import DisplayCard from "$lib/components/DisplayCard.svelte";
    import { DECK_DESCRIPTION_MAX_LENGTH, DECK_NAME_MAX_LENGTH, DECK_SIZE } from "$lib/consts/User.consts";
    import { Deck } from "$lib/data/decks/Deck.data.svelte";
    import { Card } from "$lib/data/cards/Card.data.svelte";
    import { onMount } from "svelte";
    const { data } = $props();
    const newDeck = $state(new Deck({
        id:data.deck?.id || 0,
        name: data.deck?.name || "",
        description: data.deck?.description || "",
        cards: data.deck?.cards.map(cardMeta => new Card(cardMeta)) || []
    }));
    let availableCards = $state<Card[]>([]);
    onMount(async() => {
        availableCards = await getCards()
    });
    let formattedNewDeckCards = $derived(
        newDeck.cards.reduce((acc:Record<string,{
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
    const createDeck = async() => {
        if(newDeck.name.length === 0) {
            alert("Please enter a name for your deck.");
            return;
        }
        if(newDeck.description.length > DECK_DESCRIPTION_MAX_LENGTH) {
            alert("Description is too long, maximum is " + DECK_DESCRIPTION_MAX_LENGTH + " characters.");
            return;
        }
        if(newDeck.cards.length < 1) {
            alert("You need to add at least one card to your deck.");
            return;
        }
        await newDeck.save()
    }
</script>



<div class=" min-h-28 w-full flex flex-col overflow-scroll">
    <h1>Creating new deck: <input class="bg-transparent border-b-2 border-x-0 border-t-0 border-black focus:outline-hidden focus:outline-0" type="text" oninput={(e) => {
    if(newDeck.name.length >= DECK_NAME_MAX_LENGTH) {
        newDeck.name = newDeck.name.slice(0, DECK_NAME_MAX_LENGTH);
    }}} bind:value={newDeck.name}></h1>
    <p>Description {newDeck.description.length} / {DECK_DESCRIPTION_MAX_LENGTH} </p>
    <input id="desc" class="bg-transparent w-52 border-b-2 border-x-0 border-t-0 border-black focus:outline-hidden focus:outline-0" oninput={(e) => {
    if(newDeck.description.length >= DECK_DESCRIPTION_MAX_LENGTH) {
        newDeck.description = newDeck.description.slice(0, DECK_DESCRIPTION_MAX_LENGTH);
    }}} type="text" bind:value={newDeck.description}>
</div>
   <div class="grow flex flex-row overflow-hidden">
     <div class=" grow grid grid-cols-5 shadow-[0px_0px_44px_4px_rgba(0,0,0,0.75)_inset] bg-slate-700 gap-10 overflow-y-scroll p-4">
        {#each availableCards as card }
            <DisplayCard {card} onclick={() => {
                newDeck.addCardToDeck(card)           
            }} />
        {/each}
    </div>
    <div class="w-1/5 border bg-gray-800 border-black/50 shadow flex flex-col ">
        <p class="p-2">Deck: {newDeck.cards.length} / {DECK_SIZE}</p>

        <div class="grow overflow-y-scroll">
             {#each Object.values(formattedNewDeckCards) as deckEntry}
            <div class="odd:bg-black/10 w-full flex flex-row items-center gap-2 p-2">
                <span class=" p-2 w-3 h-3 bg-white/10 rounded-full inline-flex items-center justify-center">{deckEntry.card.spirit_cost}</span> <span class="grow  truncate">{deckEntry.card.name}</span> <span>{deckEntry.count}</span>
            </div>
        {/each}
        </div>
        <div class="p-2">
            <button class="w-full transition cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick={() => {
                createDeck();
            }}>{newDeck.id ? 'Update Deck' : 'Create Deck'}</button>
        </div>
    </div>
   
   </div>
    
