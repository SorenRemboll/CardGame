<script lang="ts">
    import Board from "$lib/components/Board.svelte";
	import Hand from "$lib/components/Hand.svelte";
	
</script>
{#snippet player(isEnemy:boolean = false)}
	<div  class="{isEnemy ? 'flex-col' : 'flex-col-reverse'} player w-full flex justify-center items-center ">
		<Hand />
		<Board />
	</div>
{/snippet}
<div class="board h-dvh w-dvw flex justify-between flex-col items-center">
	{@render player(true)}
	<h1 class="text-4xl pointer-events-none text-primary/50">Spirit Fighter</h1>
	{@render player()}
</div>