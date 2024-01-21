/* eslint-disable prettier/prettier */
import axios from 'axios';
import { V2Session } from '../types/logto-auth';

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

const getUserData = async (): Promise<V2Session | undefined> => {
  const api_url = process.env.NEXT_PUBLIC_BASE_URL + `/api/logto/user-info`;
  try {
    const request = await axios.get(api_url, {
      withCredentials: true,
    });
    const response = await request.data;
    if (response.isAuthenticated == false) {
      return undefined;
    }

    const userData = response.userInfo;
    const jwtData = response.claims;

    const identityData =
      response.userInfo.identities[
        Object.keys(response.userInfo.identities)[0]
      ];
    const usermetaReq = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + '/api/logto/usermeta',
    );
    const usermetaReqRes = await usermetaReq.data;
    const sessionObject = {
      logto_id: jwtData.sub,
      provider: Object.keys(response.userInfo.identities)[0],
      providerId: identityData.userId,
      name: identityData.details.name,
      image: userData.picture,
      logto_username: userData.username,
      blacklisted: usermetaReqRes.blacklisted,
    };

    return sessionObject;
  } catch (err) {
    return undefined;
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

export { retrieveRawUserInfoServer, retrieveRawUserInfoClient, getUserData };

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
