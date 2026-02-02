<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import Button from "$lib/components/UI/Button.svelte";
    import Input from "$lib/components/UI/Input.svelte";
    import Panel from "$lib/components/UI/Panel.svelte";
    
    let emailField = $state('');
    let usernameField = $state('');
    let passwordField = $state('');
    let confirmPasswordField = $state('');
    
    const isEmailValid = $derived(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm.test(emailField));
    const isPasswordMatch = $derived(passwordField === confirmPasswordField && passwordField.length >= 8);
    const isUsernameValid = $derived(usernameField.length >= 2 && usernameField.length <= 20);
    const isFormValid = $derived(isEmailValid && isPasswordMatch && isUsernameValid);
    
    let error = $state('');
    let success: null | boolean = $state(null);
    
    // Field-specific errors for better UX
    let emailError = $derived(!emailField ? '' : !isEmailValid ? 'Please enter a valid email address' : '');
    let usernameError = $derived(!usernameField ? '' : !isUsernameValid ? 'Username must be 2-20 characters' : '');
    let passwordError = $derived(!passwordField ? '' : passwordField.length < 8 ? 'Password must be at least 8 characters' : '');
    let confirmError = $derived(!confirmPasswordField ? '' : !isPasswordMatch && confirmPasswordField.length >= 8 ? 'Passwords do not match' : '');
</script>

<div class="min-h-screen w-full flex justify-center items-center p-4 bg-linear-to-br from-dark-bg via-dark-surface to-dark-bg">
    <div class="w-full max-w-md">
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-2 bg-linear-to-r from-primary-400 to-teal-400 bg-clip-text text-transparent">
                Create Account
            </h1>
            <p class="text-gray-400">Join us and start your adventure</p>
        </div>
        
        <Panel variant="elevated" class="backdrop-blur-sm">
            {#if success === true}
                <div class="text-center py-8">
                    <div class="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-100 mb-2">Account Created!</h2>
                    <p class="text-gray-400 mb-6">Your account has been created successfully.</p>
                    <Button onclick={() => goto('/login')} class="w-full">
                        Go to Login
                    </Button>
                </div>
            {:else}
                <form 
                    method="POST" 
                    action="?/signup"
                    use:enhance={({ formElement, formData, action, cancel, submitter }) => {
                        if(!emailField || !usernameField || !passwordField || !confirmPasswordField){
                            error = "Please fill out all fields.";
                            cancel();
                            return;
                        }
                        if(!isFormValid){
                            error = "Please correct the errors above.";
                            cancel();
                            return;
                        }

                        return async ({ result, update }) => {
                            if(result.type === "error"){
                                error = result.error.message;
                                return;
                            }
                            if(result.type === "success"){
                                success = true;
                                error = '';
                                return;
                            }
                        }
                    }}
                >
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        label="Email Address"
                        placeholder="john@smith.com"
                        required
                        bind:value={emailField}
                        error={emailError}
                    />
                    
                    <Input
                        type="text"
                        id="username"
                        name="username"
                        label="Username"
                        placeholder="Choose a username"
                        required
                        bind:value={usernameField}
                        error={usernameError}
                    />
                    
                    <Input
                        type="password"
                        id="password"
                        name="password"
                        label="Password"
                        placeholder="Create a strong password"
                        required
                        bind:value={passwordField}
                        error={passwordError}
                    />
                    
                    <Input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        label="Confirm Password"
                        placeholder="Re-enter your password"
                        required
                        bind:value={confirmPasswordField}
                        error={confirmError}
                    />
                    
                    {#if error}
                        <div class="mb-5 p-3 rounded-lg bg-danger-500/10 border border-danger-500/50 text-danger-500 text-sm">
                            {error}
                        </div>
                    {/if}
                    
                    <Button type="submit" disabled={!isFormValid} class="w-full mb-4">
                        Create Account
                    </Button>
                    
                    <div class="text-center text-sm text-gray-400">
                        Already have an account? 
                        <a href="/login" class="text-primary-400 hover:text-primary-300 font-medium">
                            Sign in
                        </a>
                    </div>
                </form>
            {/if}
        </Panel>
    </div>
</div>
