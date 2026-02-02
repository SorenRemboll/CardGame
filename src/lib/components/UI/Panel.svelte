<script lang="ts">
    interface Props {
        title?: string;
        variant?: 'default' | 'elevated' | 'neon';
        class?: string;
        children: any;
    }
    
    let {
        title,
        variant = 'default',
        class: className = '',
        children
    }: Props = $props();
    
    const variantClasses = {
        default: 'bg-dark-surface border border-gray-700',
        elevated: 'bg-dark-elevated border border-gray-600 shadow-xl',
        neon: 'bg-dark-elevated border-2 border-primary-500 shadow-lg shadow-primary-900/50'
    };
</script>

<div class="rounded-xl overflow-hidden {variantClasses[variant]} {className}">
    {#if title}
        <div class="px-6 py-4 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-gray-100">{title}</h3>
        </div>
    {/if}
    <div class="p-6">
        {@render children()}
    </div>
</div>
