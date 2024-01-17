import axios from 'axios';
import qs from 'qs';

const getApiAccessToken = async () => {
  try {
    const request = await axios.post(
      process.env.MAPI_TOKEN_ENDPOINT,
      qs.stringify({
        grant_type: 'client_credentials',
        resource: process.env.MAPI_RESOURCE_URI,
        scope: 'all',
      }),
      {
        auth: {
          username: process.env.MAPI_APP_ID,
          password: process.env.MAPI_APP_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const response = await request.data;
    return response;
  } catch (error) {
    return error;
  }
};

export { getApiAccessToken };
