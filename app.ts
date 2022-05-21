import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import { createClient } from 'redis';

import { 
  getSwgohHelpUnitsList, 
  getSwgohPlayerRoster, 
  PlayerUnitEntry,
  refreshUnitsList, 
  UnitListRecord 
} from './services/swgoh-help-api';

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

// Refresh the cached units list, which expires every 24 hours, so it's ready for user request
// This prevents the first request of the day being uncached since the API call takes ~ 7 seconds
setInterval(async () => {
  await refreshUnitsList();
}, 86400000); // 24 hours in milliseconds

app.get('/units', async (req, res) => {
  const unitsList: UnitListRecord = await getSwgohHelpUnitsList();

  return res.json(unitsList);
});

app.get('/roster/:allycode', async (req, res) => {
  const playerRoster: Record<string, PlayerUnitEntry> = await getSwgohPlayerRoster(req.params.allycode);

  return res.json(playerRoster);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

export default app;