class GameState{
    private _gameId = 0;
    get gameId() {
        return this._gameId;
    }
    set gameId(value: number) {
        if (this._gameId)return;
        this._gameId = value;
    }
    turnCount = 0;
}
export const gameState = new GameState();