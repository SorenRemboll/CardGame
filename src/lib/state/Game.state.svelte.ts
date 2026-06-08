import type { Message } from "@DBG";
import { connectionState } from "./Connection.state.svelte";
import type { MessageDTO } from "$lib/types/dtos";
import { Attacker } from "./Attacker.state.svelte";
import { Defender } from "./Defender.state.svelte";

class GameState {
    messages = $state<MessageDTO[]>([]);
    async sendMessage(message: string) {
        const ok = await connectionState.sendMessage(message);
        if (!ok) return false;
        return true;
    }
    onReceiveMessage(message: MessageDTO) {
        this.messages = [...this.messages, message];
    }
    attacker = $state<Attacker>(new Attacker());
    defender = $state<Defender>(new Defender());


}
export const gameState = new GameState();