import express from 'express';
import 'dotenv/config'

import { getSwgohHelpAuthToken } from './services/swgoh-help';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});