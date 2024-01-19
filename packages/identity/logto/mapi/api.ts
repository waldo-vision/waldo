import axios from 'axios';
import qs from 'qs';
import { Role } from '../../types/logto-auth';
import { LogtoRole } from './types/mapi-type';

const getApiAccessToken = async (): Promise<string> => {
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
    throw new Error();
  }
};

const getRoleIdByName = async (
  access_token: string,
  target: string,
): Promise<string | undefined> => {
  try {
    const request = await axios.get(`${process.env.ENDPOINT}/api/roles`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const response: Array<LogtoRole> = await request.data;

    for (let i = 0; i < response.length; i++) {
      if (response[i].name.toLowerCase() == target.toLowerCase()) {
        return response[i].id;
      }
    }
    return undefined;
  } catch (error) {
    throw new Error();
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

const assignRoleToUser = async (
  access_token: string,
  logtoId: string,
  target: string,
): Promise<string> => {
  const role_id = await getRoleIdByName(access_token, target);
  try {
    await axios.post(
      `${process.env.ENDPOINT}/api/roles/${role_id}/users`,
      { userIds: [logtoId] },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return 'Successfull Assignment';
  } catch (error: any) {
    return error.response.data.message;
  }
};

export { getApiAccessToken, getUserRoles, assignRoleToUser, getRoleIdByName };
