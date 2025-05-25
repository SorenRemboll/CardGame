import type {Card} from "$lib/types/Game";
import { boardState } from "./Board.state.svelte";
import { playCard } from "$lib/actions/player";

class ActionState {
    initialX = $state(0)
    initialY = $state(0)
    x = $state(0)
    y = $state(0)
    isDragging = $state(false);
	isCardClicked = $state(false);
    private _selectedCard = $state<Card | null>(null)
    selectedCardDomNode = $state<HTMLElement | null>(null)
    moveCardState = $derived(this.isCardClicked||this.isDragging)
    startDrag = (card: Card, cardDomElement:HTMLElement) => {
		this.selectedCard = card;
		this.selectedCardDomNode = cardDomElement;
	};
    set selectedCard(card: Card | null) {
        this._selectedCard = card;
        if (card) {
           document.addEventListener("mousemove", this.moveCard);
        }else{
            document.removeEventListener("mousemove", this.moveCard);
        }

    }
    get selectedCard() {
        return this._selectedCard;
    }
   
    

    stopDrag = (indexOfBoardSlot:number|null) => {
		if (!this.selectedCard || !this.selectedCardDomNode) return;
		if (indexOfBoardSlot === null) {
			this.selectedCard = null;
			this.selectedCardDomNode = null;
			return;
		}
		boardState.setContentOfBoardNode(indexOfBoardSlot, this.selectedCardDomNode);
		this.isDragging = false;
		this.isCardClicked = false;
		playCard(this.selectedCard);
		this.selectedCard = null;
		this.selectedCardDomNode = null;
		
	};


	moveCard = (e?: MouseEvent) => {        
		if (e) {
			this.x = e.clientX;
			this.y = e.clientY;
            if(Math.abs(this.x - this.initialX) > 10 || Math.abs(this.y - this.initialY) > 10){
                this.isDragging = true;
                this.isCardClicked = false;
            }
		}
	};

}
export const actionState = new ActionState();