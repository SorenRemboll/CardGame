import type { Card } from "$lib/types/Game";
export class PlayerState {
    _name = "";
    private _deck:Card[] = [];
    graveyard:Card[] = [];
    private _discard:Card[] = [];
    hand:Card[] = $state([]);

    health = $state(0)
    maxHealth = $state(0); 
    private _id = 0;

    
    get name() {
        return this._name;
    }
    get discard() {
        return this._discard;
    }
    get deck() {
        return this._deck;
    }
    constructor(name: string, id: number, health: number = 0) {
        this.health = health;
        this.maxHealth = health;
        this._name = name;
        this._id = id;
        // Initialize the deck with some cards
        this._deck = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            name: `Card ${i}`,
            type: "Monster",
            description: "A powerful monster",
            attack: Math.floor(Math.random() * 100),
            health: Math.floor(Math.random() * 100),
        }));
    }

    get id() {
        return this._id;
    }
    takeDamage(amount: number) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
            //DEATH 
        }
    }
}