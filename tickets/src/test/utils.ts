import request from 'supertest';
import { app } from '../app';
import { signin } from './auth-helper';

export const createTicket = async (
  ticket: {
    title: string;
    price: number;
  },
  userCookie?: string[]
) => {
  return await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie ?? signin())
    .send(ticket)
    .expect(201);
};
