<script lang="ts">
    import Card from "$lib/components/Card.svelte";
	import HealthBar from "$lib/components/HealthBar.svelte";
    import { actionState } from "$lib/state/Actions.state.svelte";
    import { attackerState } from "$lib/state/Attacker.state.svelte";
    import { boardState } from "$lib/state/Board.state.svelte";
    import { defender } from "$lib/state/Defender.state.svelte";
	import { gameState } from "$lib/state/Game.state.svelte";
	import { onMount } from "svelte";

	

	
</script>

{#snippet playerBoard(isEnemy = false)}
	<div
		class="{isEnemy
			? 'flex-col'
			: 'flex-col-reverse'} player w-full flex justify-center items-center"
	>
		<div class="w-4/5 flex justify-evenly py-10 px-4 ">
			<div class="hand flex grow justify-center">
				{#each isEnemy ? attackerState.hand : defender.hand as card, index}
					<Card {card} {index} {isEnemy}/>
				{/each}
			</div>
			<div class="playerArea w-1/5 ">
				<HealthBar 
				maxHealth={isEnemy ? attackerState.maxHealth : defender.maxHealth}
				health={isEnemy ? attackerState.health : defender.health} 
			/>
			</div>
		</div>

		<div
			class="cardSlotContainer w-4/5 h-48 flex justify-evenly py-10 px-4 gap-4"
		>
			{#each Array(5) as boardSlot,index}
				<div
				bind:this={boardState.boardNodes[index]}
				onmouseup={() => {
					if(isEnemy) return
					actionState.stopDrag(index)
				}}

					class="boardItem border { actionState.moveCardState ? 'hover:bg-white/20' : ''}
					{isEnemy
						? 'border-red-500'
						: 'border-primary'} flex items-center relative justify-center h-full gap-2 transition grow"
				>

				</div>
			{/each}
		</div>
	</div>
	
{/snippet}


<div class="board h-dvh w-dvw flex relative justify-center gap-8 flex-col items-center" 
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
