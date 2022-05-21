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
  const unitsListCache = await redisClient.get(SWGOH_HELP_UNITS_LIST_KEY);
  let unitsList: UnitListRecord = JSON.parse(unitsListCache);

  if (!unitsList) {
    unitsList = await getSwgohHelpUnitsListFromApi();
    updateSwgohHelpUnitsListCache(unitsList);
  }

  return unitsList;
};

export const getSwgohHelpUnitsListFromApi = async (): Promise<UnitListRecord> => {
  const authHeaders = await getSwgohAuthHeaders();
  const response = await axios.post('https://api.swgoh.help/swgoh/data', unitsListParams, authHeaders);
  const sortedResponseData: UnitListEntry[] = getSortedUnitListResponseData(response.data);

  return Object.assign({}, ...sortedResponseData.map((entry) => ({ [entry.baseId]: entry.nameKey })));
};

const getSwgohAuthHeaders = async () => {
  const authToken = await getSwgohHelpApiAuthToken();
    
  return {
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  }; 
};

export const updateSwgohHelpUnitsListCache = async (unitsList: UnitListRecord): Promise<void> => {
  // Units list should be refreshed every 24 hours, shown here in seconds
  const expirationTime =  24 * 60 * 60;
  await redisClient.set(SWGOH_HELP_UNITS_LIST_KEY, JSON.stringify(unitsList), { EX: expirationTime });   
};

const getSortedUnitListResponseData = (unitListData: UnitListEntry[]): UnitListEntry[] => {
  return unitListData.sort((a, b) => {
    const firstNameKey = a.nameKey.toLowerCase();
    const secondNameKey = b.nameKey.toLowerCase();
  
    if (firstNameKey < secondNameKey) {
      return -1;
    }
    else if (firstNameKey > secondNameKey) {
      return 1;
    } 
    return 0;
  });
};

const getPlayerRosterParams = (allyCode: string) => {
  return {
    'allycodes': [allyCode],
    'project': {
      'starLevel': 1,
      'level': 1
    }
  };
};

interface PlayerUnitEntry {
    type: number,
    starLevel: number,
    level: number
}

export const getSwgohPlayerRoster = async (allyCode: string) => {
  const authHeaders = await getSwgohAuthHeaders();
  const playerRosterParams = getPlayerRosterParams(allyCode);
  const response = await axios.post('https://api.swgoh.help/swgoh/units', playerRosterParams, authHeaders);

  return getFormattedPlayerRosterResponseData(response.data);
};

const getFormattedPlayerRosterResponseData = (rosterData: Record<string, PlayerUnitEntry[]>) => {
  const playerRoster: Record<string, PlayerUnitEntry> = {};
    
  for (const [key, value] of Object.entries(rosterData)) {
    const [data] = value;
    playerRoster[key] = data;
  }

  return playerRoster;
};