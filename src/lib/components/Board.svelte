<script lang="ts">
   

</script>

<div class="cardSlotContainer w-4/5 h-44 flex justify-evenly py-10 px-4 gap-4">
    {#each Array(5) as cardslot}
        <div class="cardslot border border-primary flex items-center justify-center h-full gap-2 transition hover:bg-white/10 cursor-pointer grow">BoardSlot</div>
    {/each}
</div>
