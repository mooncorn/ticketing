import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  /**
   * Name of the event.
   */
  abstract subject: T['subject']; // typeof subject from T
  /**
   * A queue group name prevents the dump of history for a durable subscription
   * if connection is lost. It also makes sure an event is sent to one instance of a service.
   */
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions = () => {
    return (
      this.client
        .subscriptionOptions()
        // Not ideal in the long run by itself because NATS
        // resends all previous events to newly created services.
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        // NATS keeps track of all processed/unprocessed events by this service.
        // It does not resend events that have already been processed by this service in the past.
        .setDurableName(this.queueGroupName)
    );
  };

  listen = () => {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  };

  parseMessage = (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      return JSON.parse(data);
    } else {
      // handle buffer
      JSON.parse(data.toString('utf8'));
    }
  };
}
