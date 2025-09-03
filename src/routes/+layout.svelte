<script lang="ts">
    import { Card } from "$lib/data/cards/Card.data.svelte";
    import Header from "$lib/components/UI/Header.svelte";
    import { playerState } from "$lib/state/Player.state.svelte";
    import { user } from "$lib/state/User.state.svelte";
    import "../app.css"
    import type { LayoutProps } from "./$types";
    const { data, children }: LayoutProps = $props();
    if(data.user){
        user.id = data.user.id;
        user.userName = data.user.userName;
        user.isAuthenticated = true;
    }
    if(data.decks && data.decks.length > 0){
        playerState.setDecks(data.decks.map((deck) => {
            return {
                id: deck.id,
                name: deck.name,
                description: deck.description,
                cards: deck.cards.map(cardMeta => new Card(cardMeta))
            }
        }));
    }
</script>
<main class="flex flex-col h-full w-full overflow-hidden">
    <Header />
    {@render children()}
</main>