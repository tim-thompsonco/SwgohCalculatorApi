import 'dotenv/config';

import express from 'express';
import { createClient } from 'redis';

const app = express();
const port = process.env.PORT || 3000;

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});