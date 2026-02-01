<script lang="ts">
    import { user } from "$lib/state/User.state.svelte";
    import Button from "$lib/components/UI/Button.svelte";
    import { onMount } from "svelte";
    import { connectionState } from "$lib/state/Connection.state.svelte";

    onMount(() => {
           
    });

    
</script>

<p>finding match...</p>
<Button onclick={() => {
    
    user.cancelSearch();
}}>
    Cancel
</Button>
