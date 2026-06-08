<script lang="ts">
    import Button from "$lib/components/UI/Button.svelte";
    import Input from "$lib/components/UI/Input.svelte";
    import { formatDate } from "$lib/shared/utils";
    import { gameState } from "$lib/state/Game.state.svelte";
    import { onMount } from "svelte";
    let messageContent = $state("");
    let chatScrollEl = $state<HTMLDivElement | null>(null);
    const sendMessage = async (e: Event) => {
        e.preventDefault();
        const message = messageContent.trim();
        messageContent = "";
        const ok = await gameState.sendMessage(message);
        if (!ok) {
            console.error("Failed to send message");
        }
    };
    $effect(() => {
        gameState.messages;
        if (chatScrollEl) {
            console.log("scrolling to bottom");
            chatScrollEl.scrollTop = chatScrollEl.scrollHeight;
        }
    });
    const { game, class: className = "" } = $props();
    onMount(() => {
        if (game) {
            gameState.messages = game.messages;
        }
    });
</script>

<div
    class="{className} bg-black/10   bottom-2 flex flex-col rounded-lg gap-2 min-h-0 overflow-hidden"
>
    <div
        bind:this={chatScrollEl}
        class="message-list-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-1"
        role="log"
        aria-live="polite"
    >
        {#each gameState.messages as msg (msg.id)}
            <div
                class="flex text-main-white items-center gap-3 text-left py-1 border-b border-gray-700/50 last:border-b-0"
            >
                <span class="shrink-0 w-10 text-xs"
                    >{formatDate(msg.time_created)}</span
                >
                <span
                    class="shrink-0 w-24 text-xs truncate"
                    title={msg.userName}>{msg.userName}</span
                >
                <p class="min-w-0 text-sm m-0">
                    {msg.content}
                </p>
            </div>
        {/each}
    </div>
    <form
        onsubmit={sendMessage}
        class=" flex flex-row gap-2"
        action=""
        autocomplete="off"
    >
        <Input
            bind:value={messageContent}
            type="text"
            id="message"
            name="message"
            placeholder="Message"
            class="w-full"
            marginBottom={false}
        />
        <Button variant="primary" size="sm" type="submit">Send</Button>
    </form>
</div>

<style>
    .message-list-scroll {
        scrollbar-color: var(--color-primary-500) transparent;
        scrollbar-width: thin;
    }
    .message-list-scroll::-webkit-scrollbar {
        width: 8px;
    }
    .message-list-scroll::-webkit-scrollbar-track {
        background: transparent;
    }
    .message-list-scroll::-webkit-scrollbar-thumb {
        background: var(--color-primary-500);
        border-radius: 4px;
    }
    .message-list-scroll::-webkit-scrollbar-thumb:hover {
        background: var(--color-primary-400);
    }
</style>
