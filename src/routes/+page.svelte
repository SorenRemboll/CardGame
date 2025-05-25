<script lang="ts">
    import Card from "$lib/components/Card.svelte";
	import HealthBar from "$lib/components/HealthBar.svelte";
    import { BOARD_SIZE } from "$lib/consts/Board.consts";
    import { actionState } from "$lib/state/Actions.state.svelte";
    import { boardState } from "$lib/state/Board.state.svelte";
	import { enemyPlayerState, playerState } from "$lib/state/Player.state.svelte";
	import { onMount } from "svelte";

	onMount(() => {
		playerState.drawCard(5)
		enemyPlayerState.drawCard(5);
	});
</script>

{#snippet playerBoard(isEnemy = false)}
	<div
		class="{isEnemy
			? 'flex-col'
			: 'flex-col-reverse'} player w-full flex justify-center items-center"
	>
		<div class="w-4/5 flex justify-evenly py-10 px-4 gap-4">
			{#each isEnemy ? enemyPlayerState.hand : playerState.hand as card, index}
				<Card {card} {index} {isEnemy}/>
			{/each}
		</div>

		<div
			class="cardSlotContainer w-4/6 h-44 flex justify-evenly py-10 px-4 gap-4"
		>
			{#each Array(BOARD_SIZE) as boardSlot,index}
				<div
				bind:this={boardState.boardNodes[index]}
				onmouseup={() => {
					if(isEnemy) return
					actionState.stopDrag(index)
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


<div class="board h-screen w-screen flex relative justify-center gap-8 flex-col items-center" 
	onmouseup={() => {
		if(actionState.selectedCard && !actionState.isCardClicked) {
			actionState.stopDrag(null)
		}
	}} 
	onclick={(e) => {
		if(actionState.selectedCard && actionState.isCardClicked && e.target instanceof HTMLElement && e.target.dataset?.type !== "card") {
			actionState.isCardClicked = false;
			actionState.stopDrag(null)
		}
	}}>

	{@render playerBoard(true)}
	<h1 class="text-4xl absolute pointer-events-none text-primary/50">Spirit Fighter</h1>
	{@render playerBoard()}
</div>
