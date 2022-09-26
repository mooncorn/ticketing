import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TickedCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

const ticketCreatedListener = new TickedCreatedListener(stan);
stan.on('connect', () => {
  ticketCreatedListener.listen();
});

stan.on('close', () => {
  console.log('NATS connection closed!');
  process.exit();
});

// GRACEFUL CLIENT SHUTDOWN
// Make the NATS server terminate the connection immediately as the client shuts down
// NATS server's default behavior is wait for a specified amount of time for a client
// to go back online before terminating the connection
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
