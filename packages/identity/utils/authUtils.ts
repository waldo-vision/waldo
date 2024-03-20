/* eslint-disable prettier/prettier */
import axios, {AxiosError} from 'axios';
import { V2Session } from '../types/logto-auth';
import { prisma } from '@server/db/client';

const retrieveRawUserInfoServer = async (cookies: string | null) => {
  const api_url = process.env.NEXT_PUBLIC_BASE_URL + '/api/logto/user-info';

  const request = await axios.get(api_url, {
    withCredentials: true,
    headers: {
      cookie: cookies,
    },
  });
  const response = await request.data;
  return response;
};

const retrieveRawUserInfoClient = async () => {
  const api_url = process.env.NEXT_PUBLIC_BASE_URL + `/api/logto/user-info`;
  const request = await axios.get(api_url, {
    withCredentials: true,
  });

  const response = await request.data;
  return response;
};

const createSession = async (): Promise<V2Session | Error | AxiosError> => {
  const api_url = process.env.NEXT_PUBLIC_BASE_URL + `/api/logto/user-info`;
  try {
    const request = await axios.get(api_url, {
      withCredentials: true,
    });
    const response = await request.data;
    if (response.isAuthenticated == false) {
      return new Error("Session not found on the server!");
    }

    const userData = response.userInfo;
    const jwtData = response.claims;

    const identityData =
      response.userInfo.identities[
        Object.keys(response.userInfo.identities)[0]
      ];
    const query = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + '/api/logto/usermeta',
    );
    const waldoUser = await query.data;

    const sessionObject = {
      logto_id: jwtData.sub,
      provider: Object.keys(response.userInfo.identities)[0],
      providerId: identityData.userId,
      name: identityData.details.name,
      image: userData.picture,
      logto_username: userData.username,
      blacklisted: waldoUser.blacklisted,
      id: '',
      scope: [],
      roles: [],
    };

    return sessionObject;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("A rare error occured.")
    }
  }

  // demo user data obj
  // {
  //   logto_id: "",
  //   provider: "",
  //   providerId: "",
  //   name: "",
  //   image: "",
  //   logto_username: ""
  // }
};

export { retrieveRawUserInfoServer, retrieveRawUserInfoClient, createSession };

// utils

function convertCookieObjectToString(
  cookiesObj: Partial<{
    [key: string]: string;
  }>,
) {
  return Object.entries(cookiesObj)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
}
