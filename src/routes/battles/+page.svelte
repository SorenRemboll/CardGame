<script lang="ts">
    import Button from "$lib/components/UI/Button.svelte";
    import { user } from "$lib/state/User.state.svelte";
    const searchForGame = async () => {
        user.searchGame();
    }
</script>
<div class="p-8">
    <p>Search for battle</p>
<Button class="cursor-pointer w-40" onclick={() => {
        searchForGame()
}}>
    Find a battle!
</Button>
</div>
