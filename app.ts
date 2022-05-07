import 'dotenv/config';

import express from 'express';
import { createClient } from 'redis';

const app = express();
const port = process.env.PORT || 3000;

const client = createClient({ url: process.env.REDIS_URL });

const testRedis = async () => {
  await client.connect();
  await client.set('authToken', 'test');
  const value = await client.get('authToken');
  console.log(value);
};

testRedis();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});