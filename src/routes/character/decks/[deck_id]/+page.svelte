<script lang="ts">
    import { getCards } from "$lib/actions/Cards/Cards.actions";
    import CardDisplay from "$lib/components/Card.display.svelte";
    import {
        DECK_DESCRIPTION_MAX_LENGTH,
        DECK_NAME_MAX_LENGTH,
        DECK_SIZE,
    } from "$lib/consts/User.consts";
    import { Deck } from "$lib/data/decks/Deck.data.svelte";
    import { Card } from "$lib/data/cards/Card.data.svelte";
    import { onMount, untrack } from "svelte";
    import Button from "$lib/components/UI/Button.svelte";
	import type { CardType } from '@prisma-app/client';

    const { data } = $props();
    const initialDeckData = untrack(() => data.deck);

    const newDeck = $state(
        new Deck({
            id: initialDeckData?.id || 0,
            name: initialDeckData?.name ?? "",
            description: initialDeckData?.description || "",
            cards:
                initialDeckData?.cards.map((cardMeta) => new Card(cardMeta)) ||
                [],
        }),
    );

    let availableCards = $state<Card[]>([]);
    let searchQuery = $state("");
    let selectedType = $state<CardType | "ALL">("ALL");

    onMount(async () => {
        availableCards = await getCards();
        console.log("availableCards", availableCards);
    });

    let filteredCards = $derived(
        availableCards.filter((card) => {
            const matchesSearch =
                card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            const matchesType =
                selectedType === "ALL" || card.type === selectedType;
            return matchesSearch && matchesType;
        }),
    );

    let formattedNewDeckCards = $derived(
        newDeck.cards.reduce(
            (acc: Record<string, { card: Card; count: number }>, card) => {
                if (acc[card.id]) {
                    acc[card.id].count += 1;
                } else {
                    acc[card.id] = { card, count: 1 };
                }
                return acc;
            },
            {},
        ),
    );

    let deckStats = $derived({
        totalCards: newDeck.cards.length,
        totalSpirit: newDeck.cards.reduce(
            (sum, card) => sum + card.spirit_cost,
            0,
        ),
        avgSpirit:
            newDeck.cards.length > 0
                ? (
                      newDeck.cards.reduce(
                          (sum, card) => sum + card.spirit_cost,
                          0,
                      ) / newDeck.cards.length
                  ).toFixed(1)
                : 0,
        creatures: newDeck.cards.filter((c) => c.type === "CREATURE").length,
        spells: newDeck.cards.filter((c) => c.type === "SPELL").length,
        areas: newDeck.cards.filter((c) => c.type === "AREA").length,
    });

    const createDeck = async () => {
        if (newDeck.name.length === 0) {
            alert("Please enter a name for your deck.");
            return;
        }
        if (newDeck.description.length > DECK_DESCRIPTION_MAX_LENGTH) {
            alert(
                "Description is too long, maximum is " +
                    DECK_DESCRIPTION_MAX_LENGTH +
                    " characters.",
            );
            return;
        }
        if (newDeck.cards.length < 1) {
            alert("You need to add at least one card to your deck.");
            return;
        }
        await newDeck.save();
    };
</script>

<div class="h-full flex flex-col bg-dark-bg">
    <!-- Header Section -->
    <div class="bg-dark-surface border-b border-gray-700 p-6">
        <div class="max-w-7xl mx-auto">
            <h1 class="text-3xl font-bold text-gray-100 mb-4">
                {newDeck.id ? "Edit Deck" : "Create New Deck"}
            </h1>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label
                        for="deck-name"
                        class="block text-sm font-medium text-gray-300 mb-2"
                    >
                        Deck Name <span class="text-primary-400">*</span>
                    </label>
                    <input
                        id="deck-name"
                        type="text"
                        bind:value={newDeck.name}
                        oninput={(e) => {
                            if (newDeck.name.length >= DECK_NAME_MAX_LENGTH) {
                                newDeck.name = newDeck.name.slice(
                                    0,
                                    DECK_NAME_MAX_LENGTH,
                                );
                            }
                        }}
                        placeholder="Enter deck name..."
                        class="w-full bg-dark-elevated border-2 border-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                        {newDeck.name.length} / {DECK_NAME_MAX_LENGTH}
                    </p>
                </div>

                <div>
                    <label
                        for="deck-description"
                        class="block text-sm font-medium text-gray-300 mb-2"
                    >
                        Description <span class="text-gray-500">(optional)</span>
                    </label>
                    <input
                        id="deck-description"
                        type="text"
                        bind:value={newDeck.description}
                        oninput={(e) => {
                            if (
                                newDeck.description.length >=
                                DECK_DESCRIPTION_MAX_LENGTH
                            ) {
                                newDeck.description = newDeck.description.slice(
                                    0,
                                    DECK_DESCRIPTION_MAX_LENGTH,
                                );
                            }
                        }}
                        placeholder="Deck strategy and notes..."
                        class="w-full bg-dark-elevated border-2 border-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                        {newDeck.description.length} / {DECK_DESCRIPTION_MAX_LENGTH}
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
        <!-- Card Collection Panel -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Search & Filter Bar -->
            <div class="bg-dark-surface border-b border-gray-700 p-4">
                <div class="max-w-7xl mx-auto">
                    <div class="flex gap-4 items-center">
                        <div class="flex-1">
                            <input
                                type="text"
                                bind:value={searchQuery}
                                placeholder="Search cards..."
                                class="w-full bg-dark-elevated border-2 border-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                            />
                        </div>

                        <div class="flex gap-2">
                            <button
                                onclick={() => (selectedType = "ALL")}
                                class="px-4 py-2 rounded-lg font-medium transition-all {selectedType ===
                                'ALL'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-dark-elevated text-gray-400 hover:bg-gray-700'}"
                            >
                                All
                            </button>
                            <button
                                onclick={() => (selectedType = "CREATURE")}
                                class="px-4 py-2 rounded-lg font-medium transition-all {selectedType ===
                                'CREATURE'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-dark-elevated text-gray-400 hover:bg-gray-700'}"
                            >
                                Creatures
                            </button>
                            <button
                                onclick={() => (selectedType = "SPELL")}
                                class="px-4 py-2 rounded-lg font-medium transition-all {selectedType ===
                                'SPELL'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-dark-elevated text-gray-400 hover:bg-gray-700'}"
                            >
                                Spells
                            </button>
                            <button
                                onclick={() => (selectedType = "AREA")}
                                class="px-4 py-2 rounded-lg font-medium transition-all {selectedType ===
                                'AREA'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-dark-elevated text-gray-400 hover:bg-gray-700'}"
                            >
                                Areas
                            </button>
                        </div>
                    </div>
                    <p class="text-sm text-gray-400 mt-2">
                        Showing {filteredCards.length} of {availableCards.length}
                        cards
                    </p>
                </div>
            </div>

            <!-- Cards Grid -->
            <div class="flex-1 overflow-y-auto bg-dark-elevated p-6">
                <div class="max-w-7xl mx-auto">
                    {#if filteredCards.length === 0}
                        <div class="text-center py-16 text-gray-500">
                            <p class="text-lg">No cards found</p>
                        </div>
                    {:else}
                        <div
                            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        >
                            {#each filteredCards as card}
                                <CardDisplay
                                    {card}
                                    amount={formattedNewDeckCards[card.id]
                                        ?.count ?? 0}
                                    onclick={() => newDeck.addCardToDeck(card)}
                                />
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Deck Panel -->
        <div
            class="w-96 bg-dark-surface border-l border-gray-700 flex flex-col"
        >
            <!-- Deck Header -->
            <div class="p-4 border-b border-gray-700">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-semibold text-gray-100">
                        Current Deck
                    </h2>
                    <span
                        class="px-3 py-1 rounded-full text-sm font-medium {deckStats.totalCards ===
                        DECK_SIZE
                            ? 'bg-primary-600 text-white'
                            : deckStats.totalCards > DECK_SIZE
                              ? 'bg-danger-600 text-white'
                              : 'bg-gray-700 text-gray-300'}"
                    >
                        {deckStats.totalCards} / {DECK_SIZE}
                    </span>
                </div>

                <!-- Deck Stats -->
                <div class="grid grid-cols-2 gap-2 mb-3">
                    <div class="bg-dark-elevated rounded-lg p-2">
                        <div class="text-xs text-gray-500">Avg Spirit</div>
                        <div class="text-lg font-bold text-primary-400">
                            {deckStats.avgSpirit}
                        </div>
                    </div>
                    <div class="bg-dark-elevated rounded-lg p-2">
                        <div class="text-xs text-gray-500">Total Spirit</div>
                        <div class="text-lg font-bold text-gray-300">
                            {deckStats.totalSpirit}
                        </div>
                    </div>
                </div>

                <!-- Card Type Distribution -->
                <div class="grid grid-cols-3 gap-2">
                    <div class="bg-dark-elevated rounded-lg p-2 text-center">
                        <div class="text-xs text-gray-500">Creatures</div>
                        <div class="text-sm font-semibold text-gray-300">
                            {deckStats.creatures}
                        </div>
                    </div>
                    <div class="bg-dark-elevated rounded-lg p-2 text-center">
                        <div class="text-xs text-gray-500">Spells</div>
                        <div class="text-sm font-semibold text-gray-300">
                            {deckStats.spells}
                        </div>
                    </div>
                    <div class="bg-dark-elevated rounded-lg p-2 text-center">
                        <div class="text-xs text-gray-500">Areas</div>
                        <div class="text-sm font-semibold text-gray-300">
                            {deckStats.areas}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Deck Cards List -->
            <div class="flex-1 overflow-y-auto">
                {#if Object.values(formattedNewDeckCards).length === 0}
                    <div class="p-8 text-center text-gray-500">
                        <p class="text-sm">No cards in deck</p>
                        <p class="text-xs mt-1">Click cards to add them</p>
                    </div>
                {:else}
                    {#each Object.values(formattedNewDeckCards) as deckEntry}
                        <div
                            class="border-b border-gray-700 p-3 hover:bg-dark-elevated transition-colors group"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                >
                                    {deckEntry.card.spirit_cost}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div
                                        class="font-medium text-gray-100 truncate"
                                    >
                                        {deckEntry.card.name}
                                    </div>
                                    <div
                                        class="text-xs text-gray-500 uppercase"
                                    >
                                        {deckEntry.card.type}
                                    </div>
                                </div>
                                <div class="shrink-0 flex items-center gap-2">
                                    <span
                                        class="px-2 py-1 bg-dark-bg rounded text-gray-300 font-medium"
                                    >
                                        ×{deckEntry.count}
                                    </span>
                                    <button
                                        onclick={() =>
                                            newDeck.removeCardFromDeck(
                                                deckEntry.card,
                                            )}
                                        class="w-6 h-6 flex items-center justify-center rounded bg-danger-600/20 text-danger-400 hover:bg-danger-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>

            <!-- Save Button -->
            <div class="p-4 border-t border-gray-700">
                <Button
                    onclick={createDeck}
                    class="w-full"
                    disabled={newDeck.cards.length === 0 ||
                        newDeck.name.length === 0}
                >
                    {newDeck.id ? "Update Deck" : "Create Deck"}
                </Button>

                {#if deckStats.totalCards > DECK_SIZE}
                    <p class="text-xs text-danger-400 mt-2 text-center">
                        Deck has too many cards ({deckStats.totalCards}/{DECK_SIZE})
                    </p>
                {/if}
            </div>
        </div>
    </div>
</div>
