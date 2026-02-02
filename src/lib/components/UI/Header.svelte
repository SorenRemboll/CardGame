<script lang="ts">
    import { ROUTES } from "$lib/consts/routes";
    import { user } from "$lib/state/User.state.svelte";
    import { page } from '$app/stores';
    
    let currentPath = $derived($page.url.pathname);
    
    const isActive = (path: string) => {
        return currentPath === path || currentPath.startsWith(path + '/');
    };
</script>

<nav class="bg-dark-surface border-b border-gray-700 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-8">
                <a href="/" class="text-2xl font-bold bg-linear-to-r from-primary-400 to-teal-400 bg-clip-text text-transparent">
                    CardGame
                </a>
                
                <ul class="flex gap-1">
                    {#if user.isAuthenticated}
                        <li>
                            <a 
                                href={ROUTES.CHARACTER}
                                class="px-4 py-2 rounded-lg transition-all duration-200 {isActive(ROUTES.CHARACTER) ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-dark-elevated hover:text-white'}"
                            >
                                Character
                            </a>
                        </li>
                        <li>
                            <a 
                                href={ROUTES.CHARACTER_OVERVIEW}
                                class="px-4 py-2 rounded-lg transition-all duration-200 {isActive(ROUTES.CHARACTER_OVERVIEW) ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-dark-elevated hover:text-white'}"
                            >
                                Overview
                            </a>
                        </li>
                        <li>
                            <a 
                                href={ROUTES.CHARACTER_DECKS}
                                class="px-4 py-2 rounded-lg transition-all duration-200 {isActive(ROUTES.CHARACTER_DECKS) ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-dark-elevated hover:text-white'}"
                            >
                                Decks
                            </a>
                        </li>
                        <li>
                            <a 
                                href={ROUTES.CHARACTER_BATTLES}
                                class="px-4 py-2 rounded-lg transition-all duration-200 {isActive(ROUTES.CHARACTER_BATTLES) ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-dark-elevated hover:text-white'}"
                            >
                                Battles
                            </a>
                        </li>
                    {/if}
                </ul>
            </div>
            
            <div class="flex items-center gap-2">
                {#if user.isAuthenticated}
                    <span class="text-sm text-gray-400 mr-2">
                        {user.userName}
                    </span>
                    <button 
                        type="button" 
                        class="px-4 py-2 rounded-lg bg-danger-600 hover:bg-danger-700 text-white transition-all duration-200"
                        onclick={() => user.logout()}
                    >
                        Logout
                    </button>
                {:else}
                    <a 
                        href="/login"
                        class="px-4 py-2 rounded-lg text-gray-300 hover:bg-dark-elevated hover:text-white transition-all duration-200"
                    >
                        Login
                    </a>
                    <a 
                        href="/create-user"
                        class="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-all duration-200"
                    >
                        Sign Up
                    </a>
                {/if}
            </div>
        </div>
    </div>
</nav>