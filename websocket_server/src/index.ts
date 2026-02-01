import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createNodeWebSocket } from '@hono/node-ws'

const app = new Hono()
app.get('/', (c) => c.text('Hello Node.js!'))

const server = serve(app);

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

const wsApp = app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}` + ws)
        ws.send('Hello from server!');
      },
      onClose: (event, ws) => {
        console.log('Connection closed')
      },
      onOpen:(evt, ws) => {
        console.log('Connection opened')
      }
    }
  })
);

const sync = (data = {} ) => {
  return fetch('http://localhost:3000/api/game/sync', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      
    })
});
}

injectWebSocket(server);
export type WebSocketApp = typeof wsApp;