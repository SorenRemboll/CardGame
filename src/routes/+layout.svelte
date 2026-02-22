<script lang="ts">
	import { Deck } from "$lib/data/decks/Deck.data.svelte";
	import Header from "$lib/components/UI/Header.svelte";
	import { playerState } from "$lib/state/Player.state.svelte";
	import { user } from "$lib/state/User.state.svelte";
	import type { DeckDTO } from "$lib/types";
	import "../app.css";
	import type { LayoutProps } from "./$types";
	const { data, children }: LayoutProps = $props();

	$effect(() => {
		if (data.user) {
			user.id = data.user.id;
			user.userName = data.user.userName;
			user.isAuthenticated = true;
			user.gameState = data.user.gameState;
			user.currentGameId = data.user.gameId ?? null;
		}
		console.log(user);

		if (data.sessionId) {
			user.sessionId = data.sessionId;
		}
		if (data.decks && data.decks.length > 0) {
			const decks = (data.decks as DeckDTO[]).map((dto) =>
				Deck.fromDTO(dto),
			);
			playerState.setDecks(decks);
		}
	});
</script>

<main class="flex flex-col h-full w-full overflow-hidden">
	{#if user.gameState !== "SEARCHING" && user.gameState !== "IN_BATTLE"}
		<Header />
	{/if}
	{@render children()}
</main>
