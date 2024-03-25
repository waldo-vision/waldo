import { logtoClient } from 'identity';

// this api route is used to fetch logto user information like their identites.
export default logtoClient.handleUser({
  fetchUserInfo: true,
});
