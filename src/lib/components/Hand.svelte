<script lang="ts">
    import { onMount } from "svelte";
    import { HandState } from "$lib/state/Hand.state";
    let handState:HandState | null = $state(null)
    onMount(() => {
        handState = new HandState();
    })
</script>

<div class="w-4/5 h-44 flex justify-evenly py-10 px-4 gap-4">
    {#each Array(5) as cardslot}
        <div class="cardslot border border-primary flex items-center justify-center h-full gap-2 transition hover:bg-white/10 cursor-pointer grow">HandSlot</div>
    {/each}
</div>