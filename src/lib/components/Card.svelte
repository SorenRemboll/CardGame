<script lang="ts">
    import { actionState } from "$lib/state/Actions.state.svelte";
    import { boardState } from "$lib/state/Board.state.svelte";
    import type { Card } from "$lib/types/Game";
    
    let { card, index, isEnemy} : {
        card: Card,
        index: number,
        isEnemy: boolean,
       
    } = $props();
</script>
<div
    onmousedown={(e) => {
        if (isEnemy) return;
        actionState.initialX = e.clientX;
        actionState.initialY = e.clientY;
        actionState.x = e.clientX;
        actionState.y = e.clientY;
        actionState.startDrag(card, boardState.handnodes[index]);
    }}
    onmouseup={(e) => {
        if (isEnemy) return;
        if (!actionState.isDragging) {
            actionState.isCardClicked = true;
            actionState.startDrag(card, boardState.handnodes[index]);
        }
    }}
    bind:this={boardState.handnodes[index]}
    style:top={actionState.moveCardState && actionState.selectedCard?.id === card.id
        ? actionState.y - 74 + "px"
        : ""}
    style:left={actionState.moveCardState && actionState.selectedCard?.id === card.id
        ? actionState.x - 40 + "px"
        : ""}
    data-type="card"
    class={[
        "border w-20 h-36 flex items-center cursor-pointer justify-center hover:bg-white/10",
        {
            "absolute pointer-events-none":
                actionState.moveCardState && actionState.selectedCard?.id === card.id,
            "border-primary": !isEnemy,
            "border-red-500": isEnemy,
        },
    ]}
>
    {card.name}
</div>
