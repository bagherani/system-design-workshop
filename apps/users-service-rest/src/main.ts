/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { type User } from '@io/data-models';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/users', (req, res) => {
  const users: User[] = Array.from({ length: 10 }, (_, i) => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }));

  res.send(users);
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
