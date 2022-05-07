/* eslint-disable camelcase */
import axios from 'axios';
import url from 'url';

import { redisClient } from '../app';

const SWGOH_HELP_AUTH_TOKEN = 'authToken';
const SWGOH_HELP_UNITS_LIST_KEY = 'unitsList';

// We have to use snake case for the API request because that's what SWGOH Help uses
const authParams = new url.URLSearchParams({
  username: process.env.SWGOH_HELP_USERNAME,
  password: process.env.SWGOH_HELP_PASSWORD,
  grant_type: process.env.SWGOH_HELP_GRANT_TYPE,
  client_id: process.env.SWGOH_HELP_CLIENT_ID,
  client_secret: process.env.SWGOH_HELP_CLIENT_SECRET
});

const authHeaders = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const getSwgohHelpApiAuthToken = async (): Promise<string> => {
  let authToken: string = await redisClient.get(SWGOH_HELP_AUTH_TOKEN);

  if (!authToken) {
    const response = await axios.post('https://api.swgoh.help/auth/signin', authParams, authHeaders);
    authToken = response.data?.access_token;
    // We subtract 60 seconds from expiration time to prevent edge case where token is about to expire
    // and will by the time it's used for the API call
    const expirationTime: number = response.data?.expires_in as number - 60;
    await redisClient.set(SWGOH_HELP_AUTH_TOKEN, authToken, { EX: expirationTime });
  }

  return authToken;
};

const unitsListParams = {
  'collection': 'unitsList',
  'language': 'eng_us',
  'match': {
    'rarity': 7,
    'obtainable': true,
    'obtainableTime': 0,
    'combatType': 1
  },
  'project': {
    'baseId': 1,
    'nameKey': 1
  }
};

interface UnitListEntry {
    nameKey: string,
    baseId: string
}

export interface UnitListRecord {
    id: string
}

export const getSwgohHelpUnitsList = async (): Promise<UnitListRecord> => {
  const unitsListResponse = await redisClient.get(SWGOH_HELP_UNITS_LIST_KEY);
  let unitsList: UnitListRecord = JSON.parse(unitsListResponse);

  if (!unitsList) {
    const authToken = await getSwgohHelpApiAuthToken();
    const authHeaders = {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    };
    
    const response = await axios.post('https://api.swgoh.help/swgoh/data', unitsListParams, authHeaders);

    unitsList = Object.assign({}, ...response.data.map((entry: UnitListEntry) => 
      ({ [entry.baseId]: entry.nameKey })));
    // Units list should be refreshed every 24 hours, shown here in seconds
    const expirationTime =  24 * 60 * 60;
    await redisClient.set(SWGOH_HELP_UNITS_LIST_KEY, JSON.stringify(unitsList), { EX: expirationTime });   
  }

  return unitsList;
};