import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

const ticketCreatedPublisher = new TicketCreatedPublisher(stan);

stan.on('connect', () => {
  ticketCreatedPublisher.publish({
    id: '123',
    title: 'concert',
    price: 20,
  });
});
