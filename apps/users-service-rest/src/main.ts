/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { type User } from '@io/data-models';
import { ip } from 'address';
// TODO: complete the rest API
// import { getOrders } from '@io/data-models';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({
    message: `Server IP address: ${ip()}, Server port: ${process.env.PORT}`,
  });
});

app.get('/api/users', (req, res) => {
  const users: User[] = Array.from({ length: 10 }, (_, i) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }));

  // TODO: complete the rest API
  // get orders of the users
  // example: getOrders(users.map(x=>x.id));

  res.send(users);
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
