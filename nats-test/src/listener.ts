import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// stan is a client
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

const options = stan.subscriptionOptions().setManualAckMode(true);

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  const subscription = stan.subscribe(
    'ticket:created',
    'order-service-queue-group',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      const payload = JSON.parse(data);

      console.log(`Received event #${msg.getSequence()}: with data:`, payload);
    }

    msg.ack();
  });
});

// GRACEFUL CLIENT SHUTDOWN
// Make the NATS server terminate the connection immediately as the client shuts down
// NATS server's default behavior is wait for a specified amount of time for a client
// to go back online before terminating the connection
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
