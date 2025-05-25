<script lang="ts">

    const { maxHealth, health }: {maxHealth:number,health:number} = $props();
    const healthPercentage = $derived(health / maxHealth * 100);
    
</script>

<div class="w-44 border-red-700 h-10 border-2 rounded-lg flex items-start ">
    <div class="bg-red-700 relative h-full flex items-center transition-all " style="width: {healthPercentage}%;"><span class="absolute left-2">{health}</span></div>
</div>