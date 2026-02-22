<script lang="ts">
    import { ROUTES } from "$lib/consts/routes";
    import Button from "$lib/components/UI/Button.svelte";
    import Panel from "$lib/components/UI/Panel.svelte";
    import DeckCard from "$lib/components/UI/DeckCard.svelte";
    import type { Deck } from "$lib/data/decks/Deck.data.svelte";
    import { playerState } from "$lib/state/Player.state.svelte";
    import { user } from "$lib/state/User.state.svelte";

    let selectedDeck = $state<Deck | null>(null);

    const searchForGame = () => {
        if (!selectedDeck) return;
        user.searchGame(selectedDeck.id);
    };
</script>

<div class="min-h-screen bg-dark-bg p-6">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1
                class="text-4xl font-bold bg-linear-to-r from-primary-400 to-teal-400 bg-clip-text text-transparent mb-2"
            >
                Battles
            </h1>
            <p class="text-gray-400">Choose a deck and find an opponent</p>
        </div>

        <!-- Find Battle CTA -->
        <Panel variant="neon" class="mb-10 p-8">
            <div
                class="flex flex-col sm:flex-row items-center justify-between gap-6"
            >
                <div>
                    <h2 class="text-2xl font-bold text-gray-100 mb-2">
                        Ready to fight?
                    </h2>
                    <p class="text-gray-400">
                        Match with another player and battle with your deck.
                    </p>
                </div>
                <Button
                    size="lg"
                    class="shrink-0"
                    onclick={searchForGame}
                    disabled={!selectedDeck}
                >
                    {#if selectedDeck}
                        Find a battle
                    {:else}
                        Select a deck to find a battle
                    {/if}
                </Button>
            </div>
        </Panel>

        <!-- Your Decks Overview -->
        <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-100 mb-4">Your decks</h2>
            {#if playerState.decks.length === 0}
                <Panel variant="elevated" class="text-center py-12">
                    <p class="text-gray-400 mb-4">
                        You need at least one deck to battle.
                    </p>
                    <a href={ROUTES.CHARACTER_DECK("new-deck")}>
                        <Button variant="secondary">Create a deck</Button>
                    </a>
                </Panel>
            {:else}
                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {#each playerState.decks as deck}
                        <DeckCard
                            {deck}
                            href={ROUTES.CHARACTER_DECK(deck.id)}
                            actionLabel="Edit Deck →"
                            isSelectable
                            selected={selectedDeck?.id === deck.id}
                            onselect={() => (selectedDeck = deck)}
                        />
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
