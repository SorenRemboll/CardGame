<script lang="ts">
    import { ROUTES } from "$lib/consts/routes";
    import { playerState } from "$lib/state/Player.state.svelte";
    import Button from "$lib/components/UI/Button.svelte";
    import Panel from "$lib/components/UI/Panel.svelte";
    import { DECK_SLOTS_CAP_AMOUNT } from "$lib/consts/User.consts";
</script>

<div class="min-h-screen bg-dark-bg p-6">
    <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h1 class="text-4xl font-bold bg-linear-to-r from-primary-400 to-teal-400 bg-clip-text text-transparent mb-2">
                        My Decks
                    </h1>
                    <p class="text-gray-400">
                        Manage your card decks • {playerState.decks.length} / {DECK_SLOTS_CAP_AMOUNT} slots used
                    </p>
                </div>
                
                {#if !playerState.isAllDecksSlotsTaken}
                    <a href={ROUTES.CHARACTER_DECK('new-deck')}>
                        <Button size="lg">
                            <span class="flex items-center gap-2">
                                <span class="text-xl">+</span>
                                Create New Deck
                            </span>
                        </Button>
                    </a>
                {/if}
            </div>
            
            {#if playerState.isAllDecksSlotsTaken}
                <div class="p-4 rounded-lg bg-danger-500/10 border border-danger-500/50 text-danger-400">
                    <p class="flex items-center gap-2">
                        <span>⚠️</span>
                        You have reached the maximum number of decks ({DECK_SLOTS_CAP_AMOUNT}). Delete a deck to create a new one.
                    </p>
                </div>
            {/if}
        </div>

        <!-- Decks Grid -->
        {#if playerState.decks.length === 0}
            <Panel variant="elevated" class="text-center py-16">
                <div class="text-6xl mb-4">🎴</div>
                <h3 class="text-2xl font-bold text-gray-100 mb-2">No Decks Yet</h3>
                <p class="text-gray-400 mb-6">Create your first deck to start battling!</p>
                <a href={ROUTES.CHARACTER_DECK('new-deck')}>
                    <Button>Create Your First Deck</Button>
                </a>
            </Panel>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each playerState.decks as deck}
                    <a href={ROUTES.CHARACTER_DECK(deck.id)} class="block group">
                        <Panel variant="elevated" class="h-full transition-all duration-300 hover:border-primary-500 hover:shadow-primary-900/50">
                            <div class="flex flex-col h-full">
                                <!-- Deck Header -->
                                <div class="mb-4">
                                    <h3 class="text-xl font-bold text-gray-100 mb-2 group-hover:text-primary-400 transition-colors">
                                        {deck.name}
                                    </h3>
                                    <p class="text-sm text-gray-400 line-clamp-2">
                                        {deck.description || 'No description'}
                                    </p>
                                </div>
                                
                                <!-- Deck Stats -->
                                <div class="mt-auto space-y-3">
                                    <div class="flex items-center justify-between p-3 bg-dark-surface rounded-lg">
                                        <span class="text-sm text-gray-400">Total Cards</span>
                                        <span class="text-lg font-bold text-primary-400">{deck.cards.length}</span>
                                    </div>
                                    
                                    <!-- Card Type Breakdown (if needed) -->
                                    <div class="grid grid-cols-3 gap-2">
                                        <div class="text-center p-2 bg-dark-surface rounded-lg">
                                            <div class="text-xs text-gray-500 mb-1">Creatures</div>
                                            <div class="text-sm font-semibold text-gray-300">
                                                {deck.cards.filter(c => c.type === 'CREATURE').length}
                                            </div>
                                        </div>
                                        <div class="text-center p-2 bg-dark-surface rounded-lg">
                                            <div class="text-xs text-gray-500 mb-1">Spells</div>
                                            <div class="text-sm font-semibold text-gray-300">
                                                {deck.cards.filter(c => c.type === 'SPELL').length}
                                            </div>
                                        </div>
                                        <div class="text-center p-2 bg-dark-surface rounded-lg">
                                            <div class="text-xs text-gray-500 mb-1">Areas</div>
                                            <div class="text-sm font-semibold text-gray-300">
                                                {deck.cards.filter(c => c.type === 'AREA').length}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Edit Button -->
                                    <div class="pt-2">
                                        <div class="w-full py-2 px-4 bg-primary-600/10 border border-primary-600/30 rounded-lg text-center text-primary-400 font-medium group-hover:bg-primary-600 group-hover:text-white transition-all">
                                            Edit Deck →
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Panel>
                    </a>
                {/each}
                
                <!-- Create New Deck Card (if slots available) -->
                {#if !playerState.isAllDecksSlotsTaken}
                    <a href={ROUTES.CHARACTER_DECK('new-deck')} class="block group">
                        <Panel variant="elevated" class="h-full border-dashed hover:border-primary-500 hover:bg-primary-500/5 transition-all duration-300">
                            <div class="flex flex-col items-center justify-center h-full text-center py-8">
                                <div class="w-16 h-16 bg-primary-600/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <span class="text-3xl text-primary-400">+</span>
                                </div>
                                <h3 class="text-lg font-semibold text-gray-300 group-hover:text-primary-400 transition-colors">
                                    Create New Deck
                                </h3>
                                <p class="text-sm text-gray-500 mt-2">
                                    Build a new strategy
                                </p>
                            </div>
                        </Panel>
                    </a>
                {/if}
            </div>
        {/if}
    </div>
</div>
