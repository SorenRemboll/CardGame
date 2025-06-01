<script lang="ts">
    import { actionState } from "$lib/state/Actions.state.svelte";
    import { boardState } from "$lib/state/Board.state.svelte";
    import type { Card } from "$lib/types/Game";
    
    let { card, index, isEnemy, htmlClass} : {
        card: Card,
        index: number,
        isEnemy: boolean,
        htmlClass?: HTMLElement['classList']
    } = $props();
</script>
<div
    onmousedown={(e) => {
        if (isEnemy || boardState.isCardOnBoard(card)) return;
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
    data-id={card.id}
    class={[htmlClass,
        "border  origin-bottom transition w-32 h-48 shadow-2xl bg-slate-700 flex hover:border-emerald-300 hover:text-emerald-300 box-border justify-between flex-col text-center items-center cursor-pointer py-2",
        {
            "absolute pointer-events-none z-10 rotate-0 -m-0":
                actionState.moveCardState && actionState.selectedCard?.id === card.id,
            "rotate-0 -m-0":boardState.isCardOnBoard(card),
            "rotate-6 -m-4 z-0 hover:-translate-y-5 hover:z-10 hover:scale-125 hover:rotate-0": !boardState.isCardOnBoard(card),
            "relative ": !actionState.moveCardState && actionState.selectedCard?.id === card.id,
            "border-primary": !isEnemy,
            "border-red-500": isEnemy,
        },
    ]}
>
    <p class="h-4">{card.name}</p>
    <p class="text-xs">{card.description}</p>
    <div class="stats flex justify-between w-full items-center px-2">
        <span class="w-8 flex items-center justify-center aspect-square rounded-full bg-blue-100 text-black">{card.attack}</span>
        <span>{card.type}</span>
    </div>
</div>
