<script lang="ts">
    import { user } from "$lib/state/User.state.svelte";
    import Button from "$lib/components/UI/Button.svelte";
    import { hc } from 'hono/client'
    import type { WebSocketApp } from 'websocket/src/index.ts'
    import { onMount } from "svelte";

    onMount(() => {
        const client = hc<WebSocketApp>('http://localhost:8888')
        const ws = client.ws.$ws(0)
        ws.addEventListener('open', () => {
            setInterval(() => {
                ws.send(new Date().toString())
            }, 1000)
        })
    })

    
</script>

<p>finding match...</p>
<Button onclick={() => {
    
    user.cancelSearch();
}}>
    Cancel
</Button>
