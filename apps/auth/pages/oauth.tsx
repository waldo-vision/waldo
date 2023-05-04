import { Configuration, OAuth2Api, FrontendApi } from '@ory/client';
import { NextPageContext } from 'next';

export async function getServerSideProps(context: NextPageContext) {
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
  const session = await kratos.toSession(undefined, {
    headers: { cookie: cookies },
  });
  if (session.status != 200) {
    return authError('Session not valid (!= 200)');
  }
  if (!session.data.active) {
    return authError('Session inactive');
  }

  const oryid = session.data.id;

  const hydra = new OAuth2Api(
    new Configuration({
      basePath: process.env.ORY_HYDRA_ADMIN_URL,
    }),
  );
  const login_challenge = context.query.login_challenge?.toString();
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

function authError(text: String) {
  console.log(text);
  //Todo maybe add sentry integration here, but this will also error if it gets queried without cookies
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}

export default function login() {
  return <></>; //not needed since always empty return
}
