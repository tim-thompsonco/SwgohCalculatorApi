import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import { createClient } from 'redis';

import { getSwgohHelpUnitsList, UnitListRecord } from './data-sources/swgoh-help-api';

const app = express();
const port = process.env.PORT || 3000;

const corsWhiteList = [
  'https://swgohcalculator.herokuapp.com', 
  'https://swgohcalculator-qa.herokuapp.com', 
  'http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (corsWhiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    }
    else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

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