<script lang="ts">
	import Button from "$lib/components/UI/Button.svelte";
	import Input from "$lib/components/UI/Input.svelte";
	import { onMount } from "svelte";
	import type { PageProps } from "../$types";
	import { gameState } from "$lib/state/Game.state.svelte";
	import { formatDate } from "$lib/shared/utils";
	import ChatWindow from "./ChatWindow.svelte";
	let messageContent = $state("");
	let chatScrollEl = $state<HTMLDivElement | null>(null);
	const { data } = $props();
	$inspect(data);
</script>

<div
	class="h-dvh w-dvw flex relative justify-center gap-8 flex-col items-center"
>
	<h1 class="text-4xl absolute pointer-events-none text-primary/50">
		Spirit Fighter
	</h1>
	<ChatWindow class=" w-1/5 h-1/4 left-2 absolute" game={data.game} />
</div>
