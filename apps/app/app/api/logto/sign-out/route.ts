import { logtoClient } from 'identity';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  return logtoClient.handleSignOut('https://app.foo.bar')(request);
}
