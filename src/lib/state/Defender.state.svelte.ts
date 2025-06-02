import {PlayerState} from "$lib/state/Player.state.svelte";

class Defender extends PlayerState {
    constructor(name: string, maxHealth: number, health: number) {
        super(name, maxHealth, health);
        this.drawCard(5); // Draw 5 cards at the start
    }
    drawCard(amount: number = 1) {
        for (let i = 0; i < amount; i++) {
            if (this.deck.length > 0) {
                const randomCardIndex = Math.floor(Math.random() * this.deck.length);
                const card = this.deck[randomCardIndex];
                if (card) {
                    this.hand.push(card);
                    this.deck.splice(randomCardIndex, 1);
                }
                else{
                    //TODO: Handle case where card is not found
                    console.error("Card not found in deck");
                }
            }
        }
    }
   
}
export const defender = new Defender("Defender",1,100);