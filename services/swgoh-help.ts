import axios from 'axios';
import url from 'url';

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
}

export const getSwgohHelpAuthToken = async (): Promise<string> => {
    const response = await axios.post('https://api.swgoh.help/auth/signin', authParams, authHeaders);

    return response.data?.access_token;
}