<script lang="ts">
    import { ROUTES } from "$lib/consts/routes";
    import { user } from "$lib/state/User.state.svelte";

</script>

<nav class="p-2">
    <ul class="flex gap-2">
        <li><a href="/">Home</a></li>
        {#if user.isAuthenticated}
            <li>
                <a href={ROUTES.CHARACTER}>Character</a>
            </li>
            <li><a href={ROUTES.CHARACTER_OVERVIEW}>Overview</a></li>
            <li><a href={ROUTES.CHARACTER_DECKS}>Decks</a></li>
            <li><a href={ROUTES.CHARACTER_BATTLES}>Battles</a></li>
            <li><p class="cursor-pointer" onclick={() => {
                user.logout()
            }}>Logout</p></li>
        {:else}
            <li><a href="/login">Login</a></li>
            <li><a href="/create-user">Create User</a></li>
        {/if}
    </ul>
</nav>