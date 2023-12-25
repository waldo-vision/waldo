/* eslint-disable prettier/prettier */
import axios from 'axios';
const retrieveRawUserInfoServer = async (
  cookies: Partial<{
    [key: string]: string;
  }>,
) => {
  const api_url = `${process.env.BASE_URL}/api/logto/user-info`;
  const converted_cookies = convertCookieObjectToString(cookies);
  const request = await axios.get(api_url, {
    withCredentials: true,
    headers: {
      Cookie: cookies && converted_cookies,
    },
  });
  const response = await request.data;
  return response;
};

const retrieveRawUserInfoClient = async () => {
  const api_url = `/api/logto/user-info`;
  const request = await axios.get(api_url, {
    withCredentials: true,
  });

  const response = await request.data;
  return response;
};

const getUserData = async () => {
  const api_url = `/api/logto/user-info`;
  const request = await axios.get(api_url, {
    withCredentials: true,
  });

  // demo user data obj
  // {
  //   logto_id: "",
  //   provider: "",
  //   providerId: "",
  //   name: "",
  //   image: "",
  //   logto_username: ""
  // }

  const response = await request.data;

  const userData = response.userInfo;
  const jwtData = response.claims;

  const identityData =
    response.userInfo.identities[Object.keys(response.userInfo.identities)[0]];

  const sessionObject = {
    logto_id: jwtData.sub,
    provider: Object.keys(response.userInfo.identities)[0],
    providerId: identityData.userId,
    name: identityData.details.name,
    image: userData.picture,
    logto_username: userData.username,
  };

  return sessionObject;
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
