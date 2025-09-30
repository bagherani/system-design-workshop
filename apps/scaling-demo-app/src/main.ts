import express from 'express';
import { ip } from 'address';

const port = process.env.PORT;
const app = express();

app.get('/healthz', (req, res) => {
  res.send({
    message: `Server IP address: ${ip()}, Server port: ${port}`,
  });
});

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
