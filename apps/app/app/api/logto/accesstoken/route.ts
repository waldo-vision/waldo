import { logtoClient } from 'identity';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return logtoClient.handleUser({
    fetchUserInfo: true,
    getAccessToken: true,
    resource: process.env.NEXT_PUBLIC_RESOURCE_AUDIENCE,
  })(request);
}
