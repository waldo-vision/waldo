import { NextApiRequest, NextApiResponse } from 'next';

/*
This here is a simple oauth2 emulator used by the debug login option, to allow website testing, without needing to configure oauth projects on external providers,
this always log you in, but return no data, since that is handled in the debug_login module
*/
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Called API' + req.method + req.url);
  if (req.url == null) {
    res.status(404);
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
      expires_in: 217590, //basically forever, since refresh isn't implemented here TODO WARNING: the database only supports 4 bit integers on this value
      access_token: 'OAuthEmulatorAccesToken',
      scope: 'openid',
      refresh_token: 'OAuthEmulatorRefreshToken',
    });
  }
  res.status(200).json('No info for you, since not needed');
}
