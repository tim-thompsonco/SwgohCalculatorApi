/* eslint-disable camelcase */
import axios from 'axios';
import url from 'url';

const SWGOH_HELP_AUTH_TOKEN = 'authToken';

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
    'content-type': 'application/x-www-form-urlencoded'
  }
};

export const getSwgohHelpApiAuthToken = async (client): Promise<string> => {
  let authToken = await client.get(SWGOH_HELP_AUTH_TOKEN);

  if (!authToken) {
    const response = await axios.post('https://api.swgoh.help/auth/signin', authParams, authHeaders);
    authToken = response.data?.access_token;
    await client.set(SWGOH_HELP_AUTH_TOKEN, authToken, { EX: response.data?.expires_in });
  }

  return authToken;
};