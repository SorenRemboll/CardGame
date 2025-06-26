<script lang="ts">
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
    const submitForm = async () => {
        if (!isFormValid) {
            return;
        }
        console.log('Form submitted with:', {
            email: emailField,
            username: usernameField,
            password: passwordField,
        });
        
        const results = await fetch('/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailField,
                username: usernameField,
                password: passwordField,
            }),
        });
        const data = await results.json();
        if(!data.success){
            error = data.message
            return
        }
        alert('Successfull create user!');
        location.replace('/login')

        
    };
</script>

<div class="w-full h-full flex justify-center items-center">
    <form method="POST" class="w-3/5 mx-auto" onsubmit={(e) => {
        e.preventDefault();
        if(!isFormValid) {
            return;
        }
        submitForm();


    }}>
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
        <Button disabled={!isFormValid} />
    </form>
</div>
