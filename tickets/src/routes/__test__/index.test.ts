import request from 'supertest';
import { app } from '../../app';
import { createTicket } from '../../test/utils';

it('can fetch a list of tickets', async () => {
  const ticket1 = { title: 'titleticket1', price: 432 };
  const ticket2 = { title: 'titleticket2', price: 32 };

  const ticket1Response = await createTicket(ticket1);

  const ticket2Response = await createTicket(ticket2);

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toBe(2);
  expect(response.body[0].id).toBe(ticket1Response.body.id);
  expect(response.body[1].id).toBe(ticket2Response.body.id);
});
