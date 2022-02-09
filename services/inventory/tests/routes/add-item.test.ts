import request from 'supertest';

import { app } from '../../src/app';
import { signup } from '../signup';

it('responds with error 400 if the price is less than or equal to 0', async () => {
  const { cookie } = signup();

  await request(app)
    .post(`/api/inventory/addItem`)
    .set('Cookie', cookie)
    .send({
      title: 'Laptop',
      price: 0,
      massOfItem: 3.6,
      quantity: 10,
      description: 'Brand New Laptop',
    })
    .expect(400);
});

it('responds with error 400 if the massOfItem is less than or equal to 0', async () => {
  const { cookie } = signup();

  await request(app)
    .post(`/api/inventory/addItem`)
    .set('Cookie', cookie)
    .send({
      title: 'Laptop',
      price: 100,
      massOfItem: 0,
      quantity: 10,
      description: 'Brand New Laptop',
    })
    .expect(400);
});

it('responds with error 400 if the title is less than 3 characters', async () => {
  const { cookie } = signup();

  await request(app)
    .post(`/api/inventory/addItem`)
    .set('Cookie', cookie)
    .send({
      title: 'La',
      price: 100,
      massOfItem: 3.5,
      quantity: 10,
      description: 'Brand New Laptop',
    })
    .expect(400);
});

it('responds with error 400 if the description is less than 5 characters', async () => {
  const { cookie } = signup();

  await request(app)
    .post(`/api/inventory/addItem`)
    .set('Cookie', cookie)
    .send({
      title: 'Laptop',
      price: 100,
      massOfItem: 3.5,
      quantity: 10,
      description: 'Bran',
    })
    .expect(400);
});

// it('responds with error 201', async () => {
//   const { cookie } = signup();

//   await request(app)
//     .post(`/api/inventory/addItem`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'Laptop',
//       price: 100,
//       massOfItem: 3.5,
//       quantity: 10,
//       description: 'Brand New Laptop',
//     })
//     .expect(201);
// });
