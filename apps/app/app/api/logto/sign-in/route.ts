import { logtoClient } from 'identity';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return logtoClient.handleSignIn()(request);
}
