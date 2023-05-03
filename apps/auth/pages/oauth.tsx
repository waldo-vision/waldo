import { Configuration, OAuth2Api, FrontendApi } from '@ory/client';
import { NextPageContext } from 'next';

export async function getServerSideProps(context: NextPageContext) {
  const hydra = new OAuth2Api(
    new Configuration({
      basePath: process.env.ORY_HYDRA_ADMIN_URL,
    }),
  );
  const login_challenge = context.query.login_challenge?.toString();
  if (login_challenge == null) {
    return;
  }

  const temp = await hydra.acceptOAuth2LoginRequest({
    loginChallenge: login_challenge,
    acceptOAuth2LoginRequest: {
      subject: 'test', //todo change this, would not read user out of request
    },
  });
  return {
    redirect: {
      destination: temp.data.redirect_to,
      permanent: false,
    },
  };
}

export default function login() {
  return <></>; //not needed since always empty return
}
