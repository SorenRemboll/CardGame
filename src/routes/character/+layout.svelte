<script lang="ts">
    import type { LayoutProps } from "../$types";

	let { children }: LayoutProps = $props();
   
    

</script>

<div class=" w-full grow flex flex-col overflow-hidden">
    {@render children()}
</div>