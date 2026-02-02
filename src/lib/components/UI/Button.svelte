<script lang="ts">
    interface Props {
        type?: 'button' | 'submit';
        disabled?: boolean;
        onclick?: () => void;
        variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
        size?: 'sm' | 'md' | 'lg';
        class?: string;
        children: any;
    }
    
    let {
        type = 'submit',
        disabled = false,
        onclick = () => {},
        variant = 'primary',
        size = 'md',
        class: className = '',
        children
    }: Props = $props();
    
    const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500/50 shadow-lg shadow-primary-900/50',
        secondary: 'bg-dark-elevated hover:bg-gray-700 text-gray-100 border-2 border-gray-600 focus:ring-gray-500/50',
        danger: 'bg-danger-600 hover:bg-danger-700 text-white focus:ring-danger-500/50',
        ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500/50'
    };
    
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base'
    };
</script>

<button
    {type}
    {disabled}
    onclick={() => onclick()}
    class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {className}"
>
    {@render children()}
</button>
