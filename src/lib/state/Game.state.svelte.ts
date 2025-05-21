import { PlayerState } from "./Player.state.svelte";

class GameState{
    _gameId = 0;
    constructor(gameId: number) {
        this._gameId = gameId;
    }
    turnCount = 0;
    currentPlayersTurn: PlayerState['name'] = "";
}
export const gameState = new GameState(1);