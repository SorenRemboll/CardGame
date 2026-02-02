<script lang="ts">
    interface Props {
        type?: 'text' | 'email' | 'password' | 'number';
        id: string;
        name: string;
        label?: string;
        placeholder?: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        error?: string;
    }
    
    let {
        type = 'text',
        id,
        name,
        label,
        placeholder = '',
        value = $bindable(''),
        required = false,
        disabled = false,
        error = ''
    }: Props = $props();
</script>

<div class="mb-5">
    {#if label}
        <label
            for={id}
            class="block mb-2 text-sm font-medium text-gray-200"
        >
            {label}
            {#if required}
                <span class="text-primary-400">*</span>
            {/if}
        </label>
    {/if}
    <input
        {type}
        {id}
        {name}
        {placeholder}
        {required}
        {disabled}
        bind:value
        class="bg-dark-elevated border-2 transition-all duration-200 text-gray-100 text-sm rounded-lg block w-full p-3 placeholder-gray-500
            {error 
                ? 'border-danger-500 focus:border-danger-400 focus:ring-2 focus:ring-danger-500/20' 
                : 'border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 hover:border-gray-600'
            }
            disabled:opacity-50 disabled:cursor-not-allowed"
    />
    {#if error}
        <p class="mt-1 text-sm text-danger-500">{error}</p>
    {/if}
</div>
