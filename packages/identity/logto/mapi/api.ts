import axios from 'axios';
import qs from 'qs';
import { Role } from '../../types/logto-auth';
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
    return response.access_token;
  } catch (error) {
    return error;
  }
};

const getUserRoles = async (
  access_token: string,
  logtoId: string,
): Promise<Role[]> => {
  try {
    const request = await axios.get(
      `${process.env.ENDPOINT}/api/users/${logtoId}/roles`,

      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const response = await request.data;
    return response;
  } catch (error) {
    throw new Error();
  }
};

export { getApiAccessToken, getUserRoles };
