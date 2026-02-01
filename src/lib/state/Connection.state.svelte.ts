import { hc } from "hono/client";
import type { WebSocketApp } from "websocket/src";

class ConnectionState {
    private gameId: string | null = null;
    private client = hc<WebSocketApp>("ws://localhost:8888/"); 
    private ws = this.client.ws.$ws(0);
    constructor(gameId: string | null = null) {
        this.gameId = gameId;
        this.connect();
    }
    connect() {
        this.ws.addEventListener('open', this.onOpen);
        this.ws.addEventListener('message', this.onMessage);
    }
    disconnect() {
        this.ws.removeEventListener('open', this.onOpen);
        this.ws.removeEventListener('message', this.onMessage); 
    }
    onOpen(event:Event) {
        console.log(event);
        
    }
    onMessage(event:MessageEvent) {
        console.log(event.data);
        
    }
    sendMessage(message = "", data:any = {}) {
        const payload = {
            message,
            data
        }
        this.ws.send(JSON.stringify(payload));
    }


}
export const connectionState = new ConnectionState();