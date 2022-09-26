import { Stan } from 'node-nats-streaming';
import { Event } from './base-listener';

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish = (data: T['data']) => {
    this.client.publish(this.subject.toString(), JSON.stringify(data), () => {
      console.log('Event published');
    });
  };
}
