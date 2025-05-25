import { BOARD_SIZE } from "$lib/consts/Board.consts";

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
            this._boardNodes[indexOfBoardSlot].appendChild(cardDomElement);
        }
    }

    get handnodes() {
        return this._handNodes;
    }
    get boardNodes() {
        return this._boardNodes;
    }
}
export const boardState = new BoardState();