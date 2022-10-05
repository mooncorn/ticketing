import { Stan } from 'node-nats-streaming';
import { Event } from './event';

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish = async (data: T['data']) => {
    return new Promise<string>((resolve, reject) => {
      this.client.publish(
        this.subject.toString(),
        JSON.stringify(data),
        (err, guid) => {
          if (err) return reject(err);
          console.log('Event published to subject', this.subject);
          return resolve(guid);
        }
      );
    });
  };
}
