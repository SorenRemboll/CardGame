<script lang="ts">
    interface Props {
        /** When true, shows "Selected" instead of "Select" */
        selected?: boolean;
        onclick?: () => void;
        disabled?: boolean;
    }

    let {
        selected = false,
        onclick: handleClick,
        disabled = false,
    }: Props = $props();
</script>

<button
    type="button"
    class={selected
        ? "w-full cursor-pointer py-2 px-4  border border-primary-600/30 rounded-lg text-center font-medium bg-primary-600 text-white transition-all"
        : "w-full cursor-pointer py-2 px-4 bg-primary-600/10 border border-primary-600/30 rounded-lg text-center text-primary-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-600 hover:text-white transition-all"}
    onclick={handleClick}
    {disabled}
>
    {selected ? "Selected ✓" : "Select"}
</button>
