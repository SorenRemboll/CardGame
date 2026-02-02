<script lang="ts">
    import { actionState } from "$lib/state/Actions.state.svelte";
    import { boardState } from "$lib/state/Board.state.svelte";
    import type { Card as CardType } from "$lib/data/cards/Card.data.svelte";
    import Card from "./Card.svelte";

    interface Props {
        card: CardType;
        index: number;
        isEnemy?: boolean;
        htmlClass?: string;
    }

    let { card, index, isEnemy = false, htmlClass = "" }: Props = $props();

    // Game state management
    const handleMouseDown = (e: MouseEvent) => {
        if (isEnemy || boardState.isCardOnBoard(card)) return;
        actionState.initialX = e.clientX;
        actionState.initialY = e.clientY;
        actionState.x = e.clientX;
        actionState.y = e.clientY;
        actionState.startDrag(card, boardState.handnodes[index]);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (isEnemy) return;
        if (!actionState.isDragging) {
            actionState.isCardClicked = true;
            actionState.startDrag(card, boardState.handnodes[index]);
        }
    };

    const isDragging = $derived(
        actionState.moveCardState && actionState.selectedCard?.id === card.id,
    );
    const isOnBoard = $derived(boardState.isCardOnBoard(card));

    let cardElement: HTMLDivElement;

    $effect(() => {
        if (cardElement) {
            boardState.handnodes[index] = cardElement;
        }
    });
</script>

<div
    bind:this={cardElement}
    onmousedown={handleMouseDown}
    onmouseup={handleMouseUp}
    style:top={isDragging ? `${actionState.y - 97}px` : ""}
    style:left={isDragging ? `${actionState.x - 64}px` : ""}
    data-type="card"
    data-id={card.id}
    class="cursor-pointer {htmlClass}
        {isDragging ? 'absolute pointer-events-none z-10' : ''}
        {isOnBoard || isDragging ? 'rotate-0 m-0' : ''}
        {!isOnBoard && !isDragging
        ? 'rotate-6 -m-4 z-0 hover:-translate-y-5 hover:z-10 hover:scale-125 hover:rotate-0'
        : ''}
        {!isDragging ? 'relative' : ''}"
>
    <Card {card} {isEnemy} variant="default" />
</div>
