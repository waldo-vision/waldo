function authError(text: String, redirect: string = '/') {
  console.log(text, redirect);
  //Todo maybe add sentry integration here, but this will also error if it gets queried without cookies
  return {
    redirect: {
      destination: redirect,
      permanent: false,
    },
  };
}
export { authError };
