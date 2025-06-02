import { PlayerState } from "./Player.state.svelte";

export class AttackerState extends PlayerState{
    constructor(name: string,id:number, health: number, ) {
        super(name,id, health);
    }

}
export const attackerState = new AttackerState("Attacker", 2, 100);