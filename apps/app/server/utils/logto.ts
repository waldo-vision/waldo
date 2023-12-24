import axios from 'axios';

const retrieveUserInfo = async () => {
  const api_url = '/api/logto/user-info';
  const request = await axios.get(api_url).then(res => {
    return res;
  });
};

export { retrieveUserInfo };
