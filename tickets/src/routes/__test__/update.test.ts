import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/auth-helper';
import { createTicket } from '../../test/utils';

it('returns a 400 if the provided id is invalid', async () => {
  await request(app)
    .put('/api/tickets/gdf')
    .set('Cookie', signin())
    .send({ title: 'fsd', price: 34 })
    .expect(400);
});

it('returns a 400 if the provided price is invalid', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({ title: 'fsd', price: 'sa' })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({ title: 'fsd' })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({ title: 'fsd', price: -32 })
    .expect(400);
});

it('returns a 400 if the provided title is invalid', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({ price: 423 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({ title: '', price: 43 })
    .expect(400);
});

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({ title: '432423', price: 423 })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: '432423', price: 423 })
    .expect(401);
});

it('returns a 401 if the user does not own a ticket', async () => {
  const user1 = signin({ id: 1 });
  const user2 = signin({ id: 2 });

  const ticket = { title: 'fdasfas', price: 423 };

  // make user1 create a ticket
  const ticketResponseCreatedByUser1 = await createTicket(ticket, user1);

  // make user2 attempt to update the ticket created by user1
  await request(app)
    .put(`/api/tickets/${ticketResponseCreatedByUser1.body.id}`)
    .set('Cookie', user2)
    .send({ title: '432423', price: 423 })
    .expect(401);
});

it('updates the ticket', async () => {
  const ticketInit = { title: 'old', price: 1 };
  const ticketUpdate = { title: 'updated', price: 2 };

  const user = signin();
  const ticketResponse = await createTicket(ticketInit, user);

  const updatedTicked = await request(app)
    .put(`/api/tickets/${ticketResponse.body.id}`)
    .set('Cookie', user)
    .send(ticketUpdate)
    .expect(200);

  expect(updatedTicked.body.id).toBe(ticketResponse.body.id);
  expect(updatedTicked.body.title).toBe(ticketUpdate.title);
  expect(updatedTicked.body.price).toBe(ticketUpdate.price);
});
