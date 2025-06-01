import { BOARD_SIZE } from "$lib/consts/Board.consts";
import type { Card } from "$lib/types/Game";

class BoardState {
    private _handNodes:HTMLElement[]  = $state([]);
    private _boardSizeX = 5; // Assuming a fixed board size of 5 for simplicity
    private _boardNodes:HTMLElement[] = $state([]);
    
    setContentOfBoardNode(indexOfBoardSlot: number, cardDomElement: HTMLElement) {
        if (indexOfBoardSlot < 0 || indexOfBoardSlot >= BOARD_SIZE) {
            console.error("Index out of bounds for board slots");
            return;
        }
        if (this._boardNodes[indexOfBoardSlot]) {
            cardDomElement.style.position = "absolute";
            this._boardNodes[indexOfBoardSlot].dataset.id = cardDomElement.dataset.id;
            this._boardNodes[indexOfBoardSlot].appendChild(cardDomElement);
        }
    }

    isCardOnBoard(cardOrBoardSlot: number | Card ): boolean {
        if(typeof cardOrBoardSlot !== 'number') {
            const indexOfCard = this._boardNodes.findIndex(node =>  node.dataset.id === cardOrBoardSlot.id.toString());
            if( indexOfCard < 0) {
                return false
            }
            return this._boardNodes[indexOfCard].children.length > 0;
        }
        if (cardOrBoardSlot < 0 || cardOrBoardSlot >= BOARD_SIZE) {
            console.error("Index out of bounds for board slots");
            return false;
        }
        return this._boardNodes[cardOrBoardSlot].children.length > 0;
    }

    get handnodes() {
        return this._handNodes;
    }
    get boardNodes() {
        return this._boardNodes;
    }
}
export const boardState = new BoardState();