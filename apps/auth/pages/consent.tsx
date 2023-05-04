import { authError } from '@/lib/utils';
import { Configuration, FrontendApi, OAuth2Api } from '@ory/client';
import { NextPageContext } from 'next';

const ory = new OAuth2Api(
  new Configuration({
    basePath: process.env.ORY_HYDRA_ADMIN_URL,
  }),
);

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
  const email = session.data.identity.traits['email'];

  const challenge_text = context.query.consent_challenge?.toString();
  if (challenge_text == null) {
    return;
  }
  const challenge = await ory
    .getOAuth2ConsentRequest({ consentChallenge: challenge_text })
    .then(({ data: body }) => body);

  const data = await ory.acceptOAuth2ConsentRequest({
    consentChallenge: challenge_text,
    acceptOAuth2ConsentRequest: {
      grant_scope: challenge.requested_scope,
      grant_access_token_audience: challenge.requested_access_token_audience,
      session: {
        id_token: {
          email: email,
          image: 'TODOREPLACEIMAGE',
          name: 'TODOREPLACENAME',
          battletag: undefined,
        },
      },
    },
  });
  return {
    redirect: {
      destination: data.data.redirect_to,
      permanent: false,
    },
  };
}

export default function consent() {
  return <></>; //not needed since always empty return
}
