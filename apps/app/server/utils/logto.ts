const retrieveUserInfo = async () => {
  const api_url = '/api/logto/user-info';
  const req = await fetch(api_url);
  const res = await req.json();
  console.log(res);
};

export { retrieveUserInfo };
