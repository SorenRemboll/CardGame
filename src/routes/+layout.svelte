<script lang="ts">
	import { Deck } from "$lib/data/decks/Deck.data.svelte";
	import Header from "$lib/components/UI/Header.svelte";
	import { playerState } from "$lib/state/Player.state.svelte";
	import { user } from "$lib/state/User.state.svelte";
	import type { DeckDTO } from "$lib/types/dtos";
	import "../app.css";
	import type { LayoutProps } from "./$types";
	import { connectionState } from "$lib/state/Connection.state.svelte";
	import { onMount } from "svelte";
	const { data, children }: LayoutProps = $props();

	onMount(() => {
		if (data.user) {
			user.id = data.user.id;
			user.userName = data.user.userName;
			user.isAuthenticated = true;
			user.gameState = data.user.gameState;
		}
		if (data.decks && data.decks.length > 0) {
			const decks = (data.decks as DeckDTO[]).map((dto) =>
				Deck.fromDTO(dto),
			);
			playerState.setDecks(decks);
		}
		if (user.gameState === "IN_BATTLE" && !connectionState.isConnected) {
			connectionState.connect();
		}
	});
</script>

<main class="flex flex-col h-full w-full">
	{#if user.gameState !== "SEARCHING" && user.gameState !== "IN_BATTLE"}
		<Header />
	{/if}
	{@render children()}
</main>
