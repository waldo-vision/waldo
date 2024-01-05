import { logtoClient } from '@auth/';
import { NextApiRequest, NextApiResponse } from 'next';

export const runtime = 'edge';

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  return logtoClient.handleUser({ fetchUserInfo: true })(request, response);
}
