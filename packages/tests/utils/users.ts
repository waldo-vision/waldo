import { Roles } from 'database';

interface ITestUser {
  userId: string;
  role: Roles;
}

/* A list of dumby users with different roles */
export const testUserBasic: ITestUser = {
  userId: 'basicUser',
  role: Roles.USER,
};

export const testUserTrusted: ITestUser = {
  userId: 'trustedUser',
  role: Roles.TRUSTED,
};

export const testUserMod: ITestUser = {
  userId: 'modUser',
  role: Roles.MOD,
};

export const testUserAdmin: ITestUser = {
  userId: 'adminUser',
  role: Roles.ADMIN,
};

export const allTestUsers = [
  testUserBasic,
  testUserTrusted,
  testUserMod,
  testUserAdmin,
];

/**
 * Create a set of cookies that will be read by the session creator in the tRPC backend.
 * @param user
 * @returns a cookie string
 */
export const createUserCookie = (user: ITestUser): string => {
  return `userId=${user.userId}; provider=dumby; role=${user.role}`;
};
