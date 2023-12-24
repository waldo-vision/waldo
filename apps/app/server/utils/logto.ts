/* eslint-disable prettier/prettier */
import axios from 'axios';
const retrieveUserInfoServer = async (
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

const retrieveUserInfoClient = async () => {
  const api_url = `/api/logto/user-info`;
  const request = await axios.get(api_url, {
    withCredentials: true,
  });

  const response = await request.data;
  return response;
};

export { retrieveUserInfoServer, retrieveUserInfoClient };

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
