import type { Card } from "$lib/types/Game";
export class PlayerState {
    _name = "";
    _deck:Card[] = [];
    _graveyard:Card[] = [];
    _discard:Card[] = [];

    hand:Card[] = $state([]);
    private _id = 0;
    get name() {
        return this._name;
    }
    constructor(name: string, id: number) {
        this._name = name;
        this._id = id;
        // Initialize the deck with some cards
        this._deck = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            name: `Card ${i}`,
            type: "Monster",
            description: "A powerful monster",
        }));
    }

    get id() {
        return this._id;
    }


    drawCard(amount: number = 1) {
        for (let i = 0; i < amount; i++) {
            if (this._deck.length > 0) {
                const randomCardIndex = Math.floor(Math.random() * this._deck.length);
                const card = this._deck[randomCardIndex];
                if (card) {
                    this.hand.push(card);
                    this._deck.splice(randomCardIndex, 1);
                }
                else{
                    //TODO: Handle case where card is not found
                    console.error("Card not found in deck");
                }
            }
        }
    }
    

}
export const playerState = new PlayerState("Player 1", 1);
export const enemyPlayerState = new PlayerState("Player 2", 2);