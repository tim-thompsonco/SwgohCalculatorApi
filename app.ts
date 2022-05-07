import 'dotenv/config';

import express from 'express';
import { createClient } from 'redis';

import { getSwgohHelpUnitsList, UnitListRecord } from './data-sources/swgoh-help-api';

const app = express();
const port = process.env.PORT || 3000;

export const redisClient = createClient({ url: process.env.REDIS_URL });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/units', async (req, res) => {
  await redisClient.connect();
  const unitsList: UnitListRecord = await getSwgohHelpUnitsList();
  await redisClient.quit();

  res.json(unitsList);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});