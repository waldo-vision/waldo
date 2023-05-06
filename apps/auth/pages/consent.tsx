import { authError, hydra, kratos } from '@/lib/utils';
import { NextPageContext } from 'next';
export async function getServerSideProps(context: NextPageContext) {
  //here check if logged in, since no oauth approval if not logged in
  const cookies = context.req?.headers.cookie;
  if (cookies == null) {
    return authError('No cookies set');
  }
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
  if (session.data.identity.metadata_public == null) {
    return authError('No metadata found in session');
  }
  const provider = (session.data.identity.metadata_public as any).provider;
  const provider_id = (session.data.identity.metadata_public as any)
    .provider_id;
  const role = (session.data.identity.metadata_public as any).role;
  const email = session.data.identity.traits['email'];
  const name = session.data.identity.traits['name'];
  const image = session.data.identity.traits['image'];
  if (!(provider && provider_id && role && email && name && image)) {
    return authError('Something is null in user data');
  }

  const challenge_text = context.query.consent_challenge?.toString();
  if (challenge_text == null) {
    return;
  }
  const challenge = await hydra
    .getOAuth2ConsentRequest({ consentChallenge: challenge_text })
    .then(({ data: body }) => body);

  const data = await hydra.acceptOAuth2ConsentRequest({
    consentChallenge: challenge_text,
    acceptOAuth2ConsentRequest: {
      grant_scope: challenge.requested_scope,
      grant_access_token_audience: challenge.requested_access_token_audience,
      session: {
        id_token: {
          email: email,
          image: image,
          name: name,
          provider: provider,
          provider_id: provider_id,
          role: role,
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
