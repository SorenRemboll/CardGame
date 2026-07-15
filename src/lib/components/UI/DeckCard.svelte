<script lang="ts">
	import Panel from '$lib/components/UI/Panel.svelte';
	import Btn from '$lib/components/UI/Btn.svelte';
	import Button from '$lib/components/UI/Button.svelte';
	import type { Deck } from '$lib/data/decks/Deck.data.svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/consts/routes';
	import { startTestBattle } from '$lib/remote/user.remote';
	import { user } from '$lib/state/User.state.svelte';
	import { playerState } from '$lib/state/Player.state.svelte';

	type DeckHref = `/character/decks/${string}`;

	interface Props {
		deck: Deck;
		href: DeckHref;
		canTest?: boolean;
		/** Label for the action link (e.g. "Edit Deck" or "Select") */
		actionLabel?: string;
		isSelectable?: boolean;
		selected?: boolean;
		onselect?: () => void;
	}

	let {
		canTest = false,
		deck,
		href,
		actionLabel = 'Edit Deck →',
		isSelectable = false,
		selected = false,
		onselect
	}: Props = $props();

	let testing = $state(false);

	const testDeck = async () => {
		if (testing || !deck.id) return;
		testing = true;
		try {
			await startTestBattle({ deckId: deck.id });
			playerState.setDeck(deck);
			user.gameState = 'IN_BATTLE';
			goto(resolve(ROUTES.GAME));
		} catch (error) {
			console.error('Failed to start test battle:', error);
			testing = false;
		}
	};
</script>

<Panel variant="elevated" class="h-full ">
	<div class="flex flex-col h-full">
		<!-- Deck Header -->
		<div class="mb-4">
			<h3
				class="text-xl font-bold text-gray-100 mb-2 group-hover:text-primary-400 transition-colors"
			>
				{deck.name}
			</h3>
			<p class="text-sm text-gray-400 line-clamp-2">
				{deck.description || 'No description'}
			</p>
		</div>

		<!-- Deck Stats -->
		<div class="mt-auto space-y-3">
			<div
				class="flex items-center justify-between p-3 bg-dark-surface rounded-lg"
			>
				<span class="text-sm text-gray-400">Total Cards</span>
				<span class="text-lg font-bold text-primary-400">{deck.cards.length}</span>
			</div>

			<div class="grid grid-cols-3 gap-2">
				<div class="text-center p-2 bg-dark-surface rounded-lg">
					<div class="text-xs text-gray-500 mb-1">Creatures</div>
					<div class="text-sm font-semibold text-gray-300">
						{deck.cards.filter((c) => c.type === 'CREATURE').length}
					</div>
				</div>
				<div class="text-center p-2 bg-dark-surface rounded-lg">
					<div class="text-xs text-gray-500 mb-1">Spells</div>
					<div class="text-sm font-semibold text-gray-300">
						{deck.cards.filter((c) => c.type === 'SPELL').length}
					</div>
				</div>
				<div class="text-center p-2 bg-dark-surface rounded-lg">
					<div class="text-xs text-gray-500 mb-1">Areas</div>
					<div class="text-sm font-semibold text-gray-300">
						{deck.cards.filter((c) => c.type === 'AREA').length}
					</div>
				</div>
			</div>
			<div
				class={isSelectable || canTest
					? 'grid grid-cols-2 gap-2'
					: 'flex justify-center'}
			>
				{#if href}
					<a href={resolve(href)} class="block group">
						<div class="pt-2">
							<div
								class="w-full py-2 px-4 bg-primary-600/10 border border-primary-600/30 rounded-lg text-center text-primary-400 font-medium group-hover:bg-primary-600 group-hover:text-white transition-all"
							>
								{actionLabel}
							</div>
						</div>
					</a>
				{/if}
				{#if canTest}
					<div class="pt-2">
						<Button
							type="button"
							variant="secondary"
							size="sm"
							class="w-full"
							disabled={testing}
							onclick={testDeck}
						>
							{testing ? 'Starting…' : 'TEST'}
						</Button>
					</div>
				{/if}
				{#if isSelectable}
					<div class="pt-2">
						<Btn selected={selected} onclick={onselect} />
					</div>
				{/if}
			</div>
		</div>
	</div>
</Panel>
