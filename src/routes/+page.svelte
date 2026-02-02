<script lang="ts">
    import { user } from "$lib/state/User.state.svelte";
    import Button from "$lib/components/UI/Button.svelte";
    import Panel from "$lib/components/UI/Panel.svelte";
    import { goto } from "$app/navigation";
    
    const features = [
        {
            title: "Build Your Deck",
            description: "Craft powerful decks with unique cards and strategies",
            icon: "🎴"
        },
        {
            title: "Battle Online",
            description: "Challenge players from around the world in real-time battles",
            icon: "⚔️"
        },
        {
            title: "Collect Cards",
            description: "Discover and collect rare and powerful cards",
            icon: "✨"
        },
        {
            title: "Strategic Gameplay",
            description: "Master siege and bastion mechanics to outsmart your opponents",
            icon: "🎯"
        }
    ];
</script>

<div class="min-h-screen w-full bg-linear-to-br from-dark-bg via-dark-surface to-dark-bg">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
        <div class="absolute inset-0 bg-linear-to-r from-primary-600/10 to-teal-600/10"></div>
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);"></div>
        
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div class="text-center">
                <h1 class="text-6xl md:text-7xl font-bold mb-6">
                    <span class="bg-linear-to-r from-primary-400 via-teal-400 to-primary-400 bg-clip-text text-transparent animate-gradient">
                        Card Battle Arena
                    </span>
                </h1>
                <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Enter a world of strategic card battles. Build your deck, master your strategy, and dominate the arena.
                </p>
                
                <div class="flex gap-4 justify-center">
                    {#if user.isAuthenticated}
                        <Button size="lg" onclick={() => goto('/character')}>
                            Go to Character
                        </Button>
                        <Button size="lg" variant="secondary" onclick={() => goto('/character/decks')}>
                            View Decks
                        </Button>
                    {:else}
                        <Button size="lg" onclick={() => goto('/create-user')}>
                            Get Started
                        </Button>
                        <Button size="lg" variant="secondary" onclick={() => goto('/login')}>
                            Sign In
                        </Button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    
    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-100">
            What Makes Us Different
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each features as feature}
                <Panel variant="elevated" class="text-center hover:border-primary-500/50 transition-all duration-300 cursor-pointer group">
                    <div class="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                    </div>
                    <h3 class="text-xl font-semibold text-gray-100 mb-2">
                        {feature.title}
                    </h3>
                    <p class="text-gray-400">
                        {feature.description}
                    </p>
                </Panel>
            {/each}
        </div>
    </div>
    
    <!-- Game Mechanics Section -->
    <div class="bg-dark-elevated py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-gray-100">
                        Master the Mechanics
                    </h2>
                    <div class="space-y-6">
                        <div class="flex gap-4">
                            <div class="shrink-0 w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center text-primary-400 font-bold">
                                ⚔️
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-100 mb-1">Siege Power</h3>
                                <p class="text-gray-400">Attack your opponent's defenses with powerful siege cards</p>
                            </div>
                        </div>
                        
                        <div class="flex gap-4">
                            <div class="shrink-0 w-12 h-12 bg-teal-600/20 rounded-lg flex items-center justify-center text-teal-400 font-bold">
                                🛡️
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-100 mb-1">Bastion Defense</h3>
                                <p class="text-gray-400">Protect your character with strategic defensive plays</p>
                            </div>
                        </div>
                        
                        <div class="flex gap-4">
                            <div class="shrink-0 w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center text-primary-400 font-bold">
                                💎
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-100 mb-1">Spirit Cost</h3>
                                <p class="text-gray-400">Manage your resources wisely to play the right cards at the right time</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="relative">
                    <div class="absolute inset-0 bg-linear-to-r from-primary-600/20 to-teal-600/20 rounded-2xl blur-3xl"></div>
                    <Panel variant="neon" class="relative">
                        <div class="text-center py-12">
                            <div class="text-6xl mb-4">🎴</div>
                            <h3 class="text-2xl font-bold text-gray-100 mb-2">Ready to Play?</h3>
                            <p class="text-gray-400 mb-6">Create your first deck and enter the arena</p>
                            {#if !user.isAuthenticated}
                                <Button onclick={() => goto('/create-user')}>
                                    Join Now
                                </Button>
                            {/if}
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    </div>
    
    <!-- CTA Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-gray-100">
            Start Your Journey Today
        </h2>
        <p class="text-xl text-gray-400 mb-8">
            Join thousands of players in the ultimate card battle experience
        </p>
        {#if !user.isAuthenticated}
            <Button size="lg" onclick={() => goto('/create-user')}>
                Create Free Account
            </Button>
        {/if}
    </div>
</div>

<style>
    @keyframes gradient {
        0%, 100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }
    
    .animate-gradient {
        background-size: 200% auto;
        animation: gradient 3s ease infinite;
    }
</style>
