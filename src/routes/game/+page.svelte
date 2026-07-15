<script lang="ts">
  import { onMount } from "svelte";
	import ChatWindow from "./ChatWindow.svelte";
	const { data } = $props();
	onMount(() => {
		console.log(data);
	});
   
</script>

<div
	class="h-dvh w-dvw flex relative justify-center gap-8 flex-col items-center"
>
	<h1 class="text-4xl absolute pointer-events-none text-primary/50">
		Spirit Fighter
	</h1>
	<ChatWindow class=" w-1/5 h-1/4 left-2 absolute" game={data.game} />
</div>
