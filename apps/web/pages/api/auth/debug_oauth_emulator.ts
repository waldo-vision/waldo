import { NextApiRequest, NextApiResponse } from 'next';

/*
This here is a simple oauth2 emulator used by the debug login option, to allow website testing, without needing to configure oauth projects on external providers,
this always log you in, but return no data, since that is handled in the debug_login module
*/
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    //do not enable this in production
    res.status(404);
    return;
  }
  if (req.url == null) {
    //if no url is specified also deny
    res.status(404);
    return;
  }
  const urlsearchparams = new URL(req.url, `http://${req.headers.host}`)
    .searchParams;
  const redirect_uri = urlsearchparams.get('redirect_uri');
  const state = urlsearchparams.get('state');
  if (redirect_uri != null && req.method === 'GET') {
    //here the web browser queries the stuff
    res
      .status(302)
      .setHeader(
        'Location',
        redirect_uri + '?state=' + state + '&code=youdontneedanyaccescodeslolz',
      )
      .json('');
    return;
  } else if (req.method === 'POST') {
    //this gets queried by the nextauth framework
    res.status(200).json({
      token_type: 'Bearer',
      expires_in: 31536000, //1 year, since refresh is not implemented WARNING: the database only supports 4 bit integers on this value, RFC does not specify max length
      access_token: 'OAuthEmulatorAccesToken',
      scope: 'openid',
      refresh_token: 'OAuthEmulatorRefreshToken',
    });
  }
  res.status(200).json('No info for you, since not needed'); //This should be account data, but since auth-provdier sets profile, it is not needed.
}
