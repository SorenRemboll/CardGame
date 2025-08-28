<script lang="ts">
  import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { ROUTES } from '$lib/consts/routes';
    import { user } from '$lib/state/User.state.svelte';
  let error = $state('')
</script>

<div class="h-screen w-screen flex justify-center items-center">
  <form class="w-3/5" method="POST" use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		// `formElement` is this `<form>` element
		// `formData` is its `FormData` object that's about to be submitted
		// `action` is the URL to which the form is posted
		// calling `cancel()` will prevent the submission
		// `submitter` is the `HTMLElement` that caused the form to be submitted

		return async ({ result, update }) => {
      if(result.type === "error"){
        error = result.error.message
        return
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
        /* if(result.data?.user?.id && typeof result.data.user.id === 'number'){
          user.id = result.data.user.id;

        }
        user.userName = result.data.user.userName;
        user.isAuthenticated = true; */
      }
      //location.replace('/overview');
			// `result` is an `ActionResult` object
			// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
		};
	}} action="?/login">
    <div class="mb-5">
      <label
        for="email"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Your email</label
      >
      <input
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
        for="password"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Your password</label
      >
      <input
        type="password"
        id="password"
        value="Soer145a!Sbx98hfg"
        name="password"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
    </div>
   
    {#if error}
      <div class="flex items-start mb-5 text-red-500">
        {error}
      </div>
    {/if}
    <button
      type="submit"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >Submit</button
    >
  </form>
</div>
