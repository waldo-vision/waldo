import { Roles } from 'database';
import { Session } from 'next-auth';
import { NextApiRequest } from 'next/types';

/**
 * For testing purposes, we need the ability to disable cookie verification.
 *
 * This method will read a list of "dummy" variable that we will use to configure the
 * session object. This lets the user set in their request their `id` and `role`.
 *
 * E.g. A user can set their cookie as `role=ADMIN; userId=adminUser` if they wish
 * to identify as an admin for this request.
 */
export const createDummySession = (
  req: NextApiRequest,
): Session | undefined => {
  // Parse cookies from string to map
  const cookies = (req.headers.cookie || '')
    .split(';')
    .map(s => s.trim().split('='))
    .reduce((obj, cur) => obj.set(cur[0], cur[1]), new Map<string, string>());

  // Parse role from cookie
  let role: Roles = Roles.USER;
  switch (cookies.get('role')) {
    case 'ADMIN':
      role = Roles.ADMIN;
      break;
    case 'MOD':
      role = Roles.MOD;
      break;
    case 'TRUSTED':
      role = Roles.TRUSTED;
      break;
  }

  const session: Session = {
    user: {
      id: cookies.get('userId') || '',
      provider: cookies.get('provider') || '',
      blacklisted: false,
      role,
    },
    expires: '',
  };

  return session;
};
