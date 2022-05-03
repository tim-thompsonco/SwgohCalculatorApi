import 'dotenv/config';

import express from 'express';

import { getSwgohHelpApiAuthToken } from './data-sources/swgoh-help-api';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});