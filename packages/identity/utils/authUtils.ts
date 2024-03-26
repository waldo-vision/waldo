/* eslint-disable prettier/prettier */
import axios, { AxiosError } from 'axios';
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
  const logtoDataUrl =
    process.env.NEXT_PUBLIC_BASE_URL + `/api/logto/user-info`;
  const accessTokenUrl =
    process.env.NEXT_PUBLIC_BASE_URL + `/api/logto/accesstoken`;
  try {
    const logtoUserDataReq = await axios.get(logtoDataUrl, {
      withCredentials: true,
    });
    const logtoUserDataRes = await logtoUserDataReq.data;
    if (logtoUserDataRes.isAuthenticated == false) {
      return new Error('Session not found on the server!');
    }

    const userData = logtoUserDataRes.userInfo;
    const jwtData = logtoUserDataRes.claims;

    const identityData =
      logtoUserDataRes.userInfo.identities[
        Object.keys(logtoUserDataRes.userInfo.identities)[0]
      ];
    const waldoUserDataReq = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + '/api/logto/usermeta',
    );
    const waldoUser: { blacklisted: boolean; id: string } =
      await waldoUserDataReq.data;

    const scopeDataReq = await axios.get(accessTokenUrl, {
      withCredentials: true,
    });

    const scopeDataRes = await scopeDataReq.data;

    const sessionObject = {
      logto_id: jwtData.sub,
      provider: Object.keys(logtoUserDataRes.userInfo.identities)[0],
      providerId: identityData.userId,
      name: identityData.details.name,
      image: userData.picture,
      logto_username: userData.username,
      blacklisted: waldoUser.blacklisted,
      id: waldoUser.id,
      scope: scopeDataRes.scopes,
      roles: [],
    };

    return sessionObject;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('A rare error occured.');
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
