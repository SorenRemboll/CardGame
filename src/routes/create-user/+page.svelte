<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import Button from "$lib/components/UI/Button.svelte";
    let emailField = $state('soren.remboll@gmail.com');
    let usernameField = $state('TestUser');
    let passwordField = $state('Soer145a!Sbx98hfg');
    let confirmPasswordField = $state('Soer145a!Sbx98hfg');
    const isEmailValid = $derived(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm.test(emailField));
    const isPasswordMatch = $derived(passwordField === confirmPasswordField && passwordField.length >= 8);
    const isUsernameValid = $derived(usernameField.length >= 2 && usernameField.length <= 20);
    const isFormValid = $derived(isEmailValid && isPasswordMatch && isUsernameValid);
    let error = $state('');
    let success:null|Boolean = $state(null);
</script>

<div class="w-full h-full flex justify-center items-center">
    <form method="POST" class="w-3/5 mx-auto" use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// `formElement` is this `<form>` element
		// `formData` is its `FormData` object that's about to be submitted
		// `action` is the URL to which the form is posted
		// calling `cancel()` will prevent the submission
		// `submitter` is the `HTMLElement` that caused the form to be submitted
        if(!emailField || !usernameField || !passwordField || !confirmPasswordField){
            error = "Please fill out all fields.";
            cancel();
            return;
        }
        if(!isEmailValid){
            error = "Please enter a valid email address.";
            cancel();
            return;
        }
        if(!isUsernameValid){
            error = "Username must be between 2 and 20 characters.";
            cancel();
            return;
        }
        if(!isPasswordMatch){
            error = "Passwords do not match.";
            cancel();
            return;
        }


        if(isFormValid === false){
            error = "Please fill out the form correctly.";
            cancel();
            return;
        }

		return async ({ result, update }) => {
            if(result.type === "error"){
                error = result.error.message
                return
            }
            if(result.type === "success"){
                success = true;
                error = '';
                return;
            }}
	}} action="?/signup"> 
        <div class="mb-5">
            <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
            >
            <input
                bind:value={emailField}
                type="email"
                id="email"
                name="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="john@smith.com"
                required
            />
        </div>
        <div class="mb-5">
            <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your username</label
            >
            <input
                bind:value={usernameField}
                type="text"
                id="username"
                name="username"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
            />
        </div>
        {#if error}
            <p class="mb-5 text-red-500">
                {error}
            </p> 
        {/if}
        <div class="mb-5">
            <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your password</label
            >
            <input
                bind:value={passwordField}
                type="password"
                id="password"
                name="password"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
            />
        </div>
        <div class="mb-5">
            <label
                for="confirm-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Confirm password</label
            >
            <input
                bind:value={confirmPasswordField}
                type="password"
                id="confirm-password"
                name="confirm-password"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
            />
        </div>
        {#if success === true}
            <p class="mb-5 text-green-500">
                User created successfully!
            </p>
            <a href="/login">Go to login</a>

           {:else}
        <Button disabled={!isFormValid}> Create User</Button>

        {/if}
       
    </form>
</div>
