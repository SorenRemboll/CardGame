<script lang="ts">
	import { gameState } from "$lib/state/Game.state.svelte";
	import { enemyPlayerState, playerState } from "$lib/state/Player.state.svelte";
	import type { Card } from "$lib/types/Game";
	import { onMount } from "svelte";

	onMount(() => {
		playerState.drawCard(5)
		enemyPlayerState.drawCard(5);
	});

	let cardData = $state<{
		card: Card | null;
		cardDomElement: HTMLElement | null;
	}>({
		card: null,
		cardDomElement: null,
	});

	let x = $state(0);
	let y = $state(0);

	let initialX = $state(0);
	let initialY = $state(0);
	let isDragging = $state(false);
	let isCardClicked = $state(false);
	let moveCardState = $derived(isCardClicked||isDragging)
	$effect(() => {
		console.log("isDragging", moveCardState);
	})
	let handDomNodes: HTMLElement[] = $state([]);
	let boardDomNodes: HTMLElement[] = $state([]);
	$effect(() => {
		if(Math.abs(initialX - x) > 10 || Math.abs(initialY - y) > 10) {
			isDragging = true;
		} else {
			isDragging = false;
		}
	})
	$effect(() => {
		if (cardData.card) {
			document.addEventListener("mousemove", moveCard);
		} else {
			document.removeEventListener("mousemove", moveCard);
		}
	});
	const moveCard = (e?: MouseEvent) => {
		if (e) {
			x = e.clientX;
			y = e.clientY;
		}
	};
	const startDrag = (card: Card, index = 0) => {
		cardData.card = card;
		cardData.cardDomElement = handDomNodes[index];
	};
	const stopDrag = (indexOfBoardSlot:number|null) => {
		if (!cardData.card || !cardData.cardDomElement) return;
		if (indexOfBoardSlot === null) {
			cardData.card = null;
			cardData.cardDomElement = null;
			return;
		}
		boardDomNodes[indexOfBoardSlot].appendChild(
			cardData.cardDomElement
		);
		cardData.card = null;
		cardData.cardDomElement = null;
	};
</script>

{#snippet player(isEnemy = false)}
	<div
		class="{isEnemy
			? 'flex-col'
			: 'flex-col-reverse'} player w-full flex justify-center items-center"
	>
		<div class="w-4/5 h-44 flex justify-evenly py-10 px-4 gap-4">
			{#each isEnemy ? enemyPlayerState.hand : playerState.hand as card, index}
				<div
					onmousedown={(e) => {
						if(isEnemy)return
						initialX = e.clientX;
						initialY = e.clientY;
						x = e.clientX;
						y = e.clientY;
						startDrag(card, index);
					}}
					onmouseup={(e) => {						
						if(isEnemy) return
						if(!isDragging){	
							isCardClicked = true;
							console.log("clicked", card);					
							startDrag(card, index);
						}
						
					}}
					bind:this={handDomNodes[index]}
					style:top={moveCardState && cardData.card?.id === card.id ? y - 74 + "px" : ""}
					style:left={moveCardState && cardData.card?.id === card.id ? x - 40 + "px" : ""}
					class={[
						"border w-20 h-36 flex items-center cursor-pointer justify-center hover:bg-white/10",
						{
							"absolute pointer-none:":
								moveCardState && cardData.card?.id === card.id,
							"border-primary": !isEnemy,
							"border-red-500": isEnemy,
						},
					]}
				>
					{card.name}
				</div>
			{/each}
		</div>

		<div
			class="cardSlotContainer w-4/5 h-44 flex justify-evenly py-10 px-4 gap-4"
		>
			{#each Array(5) as boardSlot,index}
				<div
				bind:this={boardDomNodes[index]}
				onmouseup={() => {
					if(isEnemy) return
					stopDrag(index)
				}}
				
					class="boardSlot border {isEnemy
						? 'border-red-500'
						: 'border-primary'} flex items-center justify-center h-full gap-2 transition hover:bg-white/10 cursor-pointer grow"
				>
					BoardSlot
				</div>
			{/each}
		</div>
	</div>
{/snippet}
<div class="board h-dvh w-dvw flex relative justify-center flex-col items-center" onmouseup={() => {
		if(cardData.card) {
			stopDrag(null)
		}
	}}>
	{@render player(true)}
	<h1 class="text-4xl absolute pointer-events-none text-primary/50">Spirit Fighter</h1>
	{@render player()}
</div>
