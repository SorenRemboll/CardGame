<script lang="ts">
    import Card from "./Card.svelte";
    import type { Card as CardType } from "$lib/data/cards/Card.data.svelte";

    interface Props {
        card: CardType;
        onclick?: () => void;
        isEnemy?: boolean;
        amount?: number;
    }

    let { card, onclick, isEnemy = false, amount }: Props = $props();
    let disableClass = $derived(
        amount && amount == 2
            ? "opacity-50 cursor-not-allowed grayscale-50"
            : "opacity-100 cursor-pointer",
    );
</script>

<div {onclick} class="w-fit relative" role="button" tabindex="0">
    <div class="{disableClass} relative">
        <Card {card} {isEnemy} variant="hover" />
    </div>
    {#if amount && amount > 0}
        <div
            class="absolute -top-4 -right-4 bg-primary-500 text-white text-xs w-8 h-8 flex items-center justify-center rounded-full"
        >
            {amount}
        </div>
    {/if}
</div>
