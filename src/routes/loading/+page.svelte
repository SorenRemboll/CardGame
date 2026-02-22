<script lang="ts">
    import { user } from "$lib/state/User.state.svelte";
    import { connectionState } from "$lib/state/Connection.state.svelte";
    import Button from "$lib/components/UI/Button.svelte";
    import { onMount } from "svelte";

    let searchTime = $state(0);
    let dots = $state("");

    onMount(() => {
        // Reconnect and re-enter queue after refresh (user stays SEARCHING in DB)
        if (user.sessionId) {
            connectionState.connect().then(() => {
                connectionState.findGame(user.sessionId);
            });
        }

        const timer = setInterval(() => {
            searchTime++;
        }, 1000);

        const dotsTimer = setInterval(() => {
            dots = dots.length >= 3 ? "" : dots + ".";
        }, 500);

        return () => {
            clearInterval(timer);
            clearInterval(dotsTimer);
        };
    });

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0
            ? `${mins}:${secs.toString().padStart(2, "0")}`
            : `${secs}s`;
    };
</script>

<div class="min-h-screen bg-dark-bg flex items-center justify-center p-4">
    <div class="text-center max-w-md w-full">
        <!-- Animated card stack -->
        <div class="relative w-32 h-40 mx-auto mb-8">
            <!-- Card 1 (back) -->
            <div
                class="absolute inset-0 bg-dark-elevated border-2 border-gray-600 rounded-xl
                transform -rotate-12 animate-pulse"
            ></div>
            <!-- Card 2 (middle) -->
            <div
                class="absolute inset-0 bg-dark-elevated border-2 border-gray-600 rounded-xl
                transform rotate-6 animate-pulse delay-100"
            ></div>
            <!-- Card 3 (front) with glow -->
            <div
                class="absolute inset-0 bg-dark-surface border-2 border-primary-500 rounded-xl
                shadow-lg shadow-primary-500/30 flex items-center justify-center"
            >
                <!-- Spinning ring -->
                <div
                    class="w-16 h-16 border-4 border-gray-700 border-t-primary-500 rounded-full animate-spin"
                ></div>
            </div>
        </div>

        <!-- Status text -->
        <h1 class="text-2xl font-bold text-gray-100 mb-2">
            Finding Opponent{dots}
        </h1>
        <p class="text-gray-400 mb-6">Searching for a worthy challenger</p>

        <!-- Search time -->
        <div
            class="inline-flex items-center gap-2 px-4 py-2 bg-dark-elevated rounded-full border border-gray-700 mb-8"
        >
            <div
                class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"
            ></div>
            <span class="text-gray-300 text-sm"
                >Search time: {formatTime(searchTime)}</span
            >
        </div>

        <!-- Tips section -->
        <div class="bg-dark-surface border border-gray-700 rounded-xl p-4 mb-8">
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Tip
            </p>
            <p class="text-sm text-gray-400">
                Build a balanced deck with creatures of varying spirit costs for
                better early and late game options.
            </p>
        </div>

        <!-- Cancel button -->
        <Button variant="secondary" onclick={() => user.cancelSearch()}>
            Cancel Search
        </Button>
    </div>
</div>

<style>
    .delay-100 {
        animation-delay: 100ms;
    }
</style>
