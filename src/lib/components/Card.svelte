<script lang="ts">
    import type { Card } from "$lib/data/cards/Card.data.svelte";

    interface Props {
        card: Card;
        isEnemy?: boolean;
        variant?: "default" | "hover";
        class?: string;
    }

    let {
        card,
        isEnemy = false,
        variant = "default",
        class: className = "",
    }: Props = $props();
</script>

<div class="group relative w-card-width h-card-height {className}">
    <!-- Card Inner Container -->
    <div
        class="absolute inset-0 rounded-xl overflow-hidden shadow-2xl transition-all duration-300
        {isEnemy
            ? 'bg-dark-elevated border-2 border-danger-500'
            : 'bg-dark-elevated border-2 border-gray-600 group-hover:border-primary-500'}
        {variant === 'hover'
            ? 'group-hover:shadow-primary-900/50 group-hover:shadow-xl group-hover:-translate-y-2'
            : ''}"
    >
        <!-- Card Header -->
        <div
            class="border-b p-3
            {isEnemy
                ? 'bg-danger-900/20 border-danger-500/50'
                : 'bg-dark-surface border-gray-600'}"
        >
            <p class="font-semibold text-gray-100 text-sm truncate">
                {card.name}
            </p>
        </div>

        <!-- Card Body -->
        <div class="p-4 flex flex-col h-[calc(100%-8rem)]">
            <div class="flex-1">
                <p class="text-xs text-gray-400 leading-relaxed line-clamp-6">
                    {card.description}
                </p>
            </div>
        </div>

        <!-- Card Footer Stats -->
        <div
            class="absolute bottom-0 left-0 right-0 border-t p-3
            {isEnemy
                ? 'bg-danger-900/20 border-danger-500/50'
                : 'bg-dark-surface border-gray-600'}"
        >
            <div class="flex justify-between items-center">
                <!-- Spirit Cost -->
                <div class="flex items-center gap-2">
                    <span
                        class="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold shadow-lg
                        {isEnemy ? 'bg-danger-600' : 'bg-primary-600'}"
                    >
                        {card.spirit_cost}
                    </span>
                    <span class="text-xs text-gray-400">Spirit</span>
                </div>

                <!-- Card Type -->
                <span
                    class="px-2 py-1 rounded-md bg-gray-700 text-xs text-gray-300 font-medium uppercase"
                >
                    {card.type}
                </span>
            </div>

            <!-- Siege & Bastion Stats -->
            <div class="flex gap-2 mt-2">
                <div
                    class="flex-1 flex items-center gap-1 px-2 py-1 rounded bg-danger-600/20 border border-danger-500/30"
                >
                    <span class="text-xs text-danger-400">⚔️</span>
                    <span class="text-xs text-gray-300">{card.siege}</span>
                </div>
                <div
                    class="flex-1 flex items-center gap-1 px-2 py-1 rounded bg-teal-600/20 border border-teal-500/30"
                >
                    <span class="text-xs text-teal-400">🛡️</span>
                    <span class="text-xs text-gray-300">{card.bastion}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Glow effect on hover -->
    {#if variant === "hover"}
        <div
            class="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/5 rounded-xl blur-xl transition-all duration-300 -z-10"
        ></div>
    {/if}
</div>
