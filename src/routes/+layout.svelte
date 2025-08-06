<script lang="ts">
    import Header from "$lib/components/UI/Header.svelte";
    import { user } from "$lib/state/User.state.svelte";
    import "../app.css"
    import type { LayoutProps } from "./$types";
    const { data, children }: LayoutProps = $props();
    if(data.user){
        user.id = data.user.id;
        user.userName = data.user.userName;
        user.isAuthenticated = true;
    }
</script>
<main class="p-4">
    <Header />
    {@render children()}
</main>