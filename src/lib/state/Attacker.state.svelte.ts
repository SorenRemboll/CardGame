import type { Card } from '$lib/data/cards/Card.data.svelte';
export class AttackerState{
    graveyard:Card[] = [];
    hand:Card[] = $state([]);

    health = $state(0)
    maxHealth = $state(0); 
    private _id = 0;

    constructor( id: number, health: number = 0) {
        this.health = health;
        this.maxHealth = health;
        this._id = id;
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
export const attackerState = new AttackerState( 2, 100);