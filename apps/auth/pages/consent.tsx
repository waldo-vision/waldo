import { Configuration, OAuth2Api } from '@ory/client';
import { NextPageContext } from 'next';

const ory = new OAuth2Api(
  new Configuration({
    basePath: process.env.ORY_HYDRA_ADMIN_URL,
  }),
);

export async function getServerSideProps(context: NextPageContext) {
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
          email: 'TESTEMAIL',
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
