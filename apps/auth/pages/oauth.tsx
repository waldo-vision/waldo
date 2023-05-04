import { authError } from '@/lib/utils';
import { Configuration, OAuth2Api, FrontendApi } from '@ory/client';
import { NextPageContext } from 'next';

export async function getServerSideProps(context: NextPageContext) {
  const login_challenge = context.query.login_challenge?.toString();

  //here check if logged in, since no oauth approval if not logged in
  const cookies = context.req?.headers.cookie;
  if (cookies == null) {
    return authError('No cookies set');
  }
  const kratos = new FrontendApi( //the built in kratos does not work for some reason
    new Configuration({
      basePath: process.env.ORY_SDK_URL,
    }),
  );
  const session = await kratos
    .toSession(undefined, {
      headers: { cookie: cookies },
    })
    .catch(() => null);
  if (session == null || session.status != 200) {
    if (login_challenge != null) {
      return authError(
        'Session not valid (!= 200)',
        process.env.ORY_SDK_URL +
          '/self-service/login/browser?login_challenge=' +
          login_challenge,
      );
    }
    return authError('Session not valid (!= 200)');
  }
  if (!session.data.active) {
    return authError('Session inactive');
  }

  const oryid = session.data.identity.id; //this is userid and not sessionid

  const hydra = new OAuth2Api(
    new Configuration({
      basePath: process.env.ORY_HYDRA_ADMIN_URL,
    }),
  );
  if (login_challenge == null) {
    return authError('no login challenge found');
  }

  const temp = await hydra.acceptOAuth2LoginRequest({
    loginChallenge: login_challenge,
    acceptOAuth2LoginRequest: {
      subject: oryid,
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
