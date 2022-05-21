import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/auth-helper';
import mongoose from 'mongoose';

it('returns a 404 if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const ticket = {
    title: 'fdsafas',
    price: 432.3,
  };

  // create a ticket
  const repsonse = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send(ticket)
    .expect(201);

  // fetch the ticket
  const getResponse = await request(app)
    .get(`/api/tickets/${repsonse.body.id}`)
    .send()
    .expect(200);

  expect(getResponse.body.id).toBe(repsonse.body.id);
  expect(getResponse.body.title).toBe(ticket.title);
  expect(getResponse.body.price).toBe(ticket.price);
});

it('returns a 400 if id is invalid', async () => {
  await request(app).get('/api/tickets/dfas').send().expect(400);
});
