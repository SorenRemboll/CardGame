<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { ROUTES } from '$lib/consts/routes';
    import { user } from '$lib/state/User.state.svelte';
    import Input from '$lib/components/UI/Input.svelte';
    import Button from '$lib/components/UI/Button.svelte';
    import Panel from '$lib/components/UI/Panel.svelte';
    
    let email = $state('');
    let password = $state('');
    let error = $state('');
</script>

<div class="min-h-screen w-full flex justify-center items-center p-4 bg-linear-to-br from-dark-bg via-dark-surface to-dark-bg">
    <div class="w-full max-w-md">
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2 bg-linear-to-r from-primary-400 to-teal-400 bg-clip-text text-transparent">
                Welcome Back
            </h1>
            <p class="text-gray-400">Sign in to your account to continue</p>
        </div>
        
        <Panel variant="elevated" class="backdrop-blur-sm">
            <form 
                method="POST" 
                action="?/login"
                use:enhance={({ formElement, formData, action, cancel, submitter }) => {
                    return async ({ result, update }) => {
                        if(result.type === "error"){
                            error = result.error.message;
                            return;
                        }
                        if(result.type === "success"){
                            error = '';
                            if(!result.data?.user) {
                                error = 'No user data returned from server.';
                                return;
                            }
                            const loggedInUser = result.data.user as { id: number, userName: string};
                            user.id = loggedInUser.id;
                            user.userName = loggedInUser.userName;
                            user.isAuthenticated = true;
                            goto(ROUTES.CHARACTER);
                        }
                    };
                }}
            >
                <Input
                    type="email"
                    id="email"
                    name="email"
                    label="Email Address"
                    placeholder="john@smith.com"
                    required
                    bind:value={email}
                />
                
                <Input
                    type="password"
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    required
                    bind:value={password}
                />
                
                {#if error}
                    <div class="mb-5 p-3 rounded-lg bg-danger-500/10 border border-danger-500/50 text-danger-500 text-sm">
                        {error}
                    </div>
                {/if}
                
                <Button type="submit" class="w-full mb-4">
                    Sign In
                </Button>
                
                <div class="text-center text-sm text-gray-400">
                    Don't have an account? 
                    <a href="/create-user" class="text-primary-400 hover:text-primary-300 font-medium">
                        Sign up
                    </a>
                </div>
            </form>
        </Panel>
    </div>
</div>
