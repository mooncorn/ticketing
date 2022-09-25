import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

// stan is a client
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

const options = stan
  .subscriptionOptions()
  .setManualAckMode(true)
  // Not ideal in the long run by itself because NATS
  // resends all previous events to newly created services.
  .setDeliverAllAvailable()
  // NATS keeps track of all processed/unprocessed events by this service.
  // It does not resend events that have already been processed by this service in the past.
  .setDurableName('some-service');

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  const subscription = stan.subscribe(
    'ticket:created',
    // A queue group name prevents the dump of history for a durable subscription
    // if connection is lost. It also makes sure an event is sent to one instance of a service.
    'service-queue-group-name',
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
