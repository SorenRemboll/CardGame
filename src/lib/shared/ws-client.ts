import type { ClientMessage, ServerMessage } from './ws-types';

type MessageHandler<T extends ServerMessage['type']> = (
    message: Extract<ServerMessage, { type: T }>
) => void;

export function createWSClient(url: string) {
    let ws: WebSocket | null = null;
    const handlers = new Map<string, Set<MessageHandler<any>>>();

    return {
        get isConnected() {
            return ws?.readyState === WebSocket.OPEN;
        },

        connect() {
            ws = new WebSocket(url);

            ws.onmessage = (event) => {
                const message: ServerMessage = JSON.parse(event.data);
                const typeHandlers = handlers.get(message.type);
                typeHandlers?.forEach(handler => handler(message));

                // Also call 'all' handlers
                handlers.get('*')?.forEach(handler => handler(message));
            };

            return new Promise<void>((resolve, reject) => {
                if (!ws) return reject();
                ws.onopen = () => resolve();
                ws.onerror = () => reject();
            });
        },

        disconnect() {
            ws?.close();
            ws = null;
        },

        send(message: ClientMessage) {
            if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
            }
        },

        // Type-safe event handlers
        on<T extends ServerMessage['type']>(type: T, handler: MessageHandler<T>) {
            if (!handlers.has(type)) handlers.set(type, new Set());
            handlers.get(type)!.add(handler);

            // Return unsubscribe function
            return () => handlers.get(type)?.delete(handler);
        },

        // Listen to all messages
        onAny(handler: (message: ServerMessage) => void) {
            if (!handlers.has('*')) handlers.set('*', new Set());
            handlers.get('*')!.add(handler);
            return () => handlers.get('*')?.delete(handler);
        }
    };
}

export type WSClient = ReturnType<typeof createWSClient>;
