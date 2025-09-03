<script lang="ts">
    import type { Card } from "$lib/data/cards/Card.data.svelte";
    let { card, onclick} : {
        card: Card,
        onclick: () => void,
    } = $props();
</script>
<div
    onclick="{onclick}"
    class= "border origin-bottom transition w-card-width h-card-height shadow-2xl bg-slate-700 flex box-border justify-between flex-col text-center items-center cursor-pointer py-2"
>
    <p class="h-4">{card.name}</p>
    <p class="text-xs">{card.description}</p>
    <div class="stats flex justify-between w-full items-center px-2">
        <span class="w-8 flex items-center justify-center aspect-square rounded-full bg-blue-100 text-black">{card.spirit_cost}</span>
        <span>{card.type}</span>
    </div>
</div>
