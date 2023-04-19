import { Roles } from 'database';
import { prisma } from './db';

interface ITestUser {
  userId: string;
  email: string;
  role: Roles;
}

/* A list of dummy users with different roles */
export const testUserBasic: ITestUser = {
  userId: 'clglqupom00bp5s87fxip254i',
  email: 'basic@waldo.vision',
  role: Roles.USER,
};

export const testUserTrusted: ITestUser = {
  userId: 'clglqupom00bp5s87fxip254a',
  email: 'trusted@waldo.vision',
  role: Roles.TRUSTED,
};

export const testUserMod: ITestUser = {
  userId: 'clglqupom00bp5s87fxip254b',
  email: 'mod@waldo.vision',
  role: Roles.MOD,
};

export const testUserAdmin: ITestUser = {
  userId: 'clglqupom00bp5s87fxip254c',
  email: 'admin@waldo.vision',
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
  return `userId=${user.userId}; provider=dummy; role=${user.role}`;
};

/**
 * Populate the database with each of the test users.
 */
export const setUpUsers = async () => {
  await prisma.user.createMany({
    data: allTestUsers.map(user => ({
      id: user.userId,
      name: user.userId,
      email: user.email,
      role: user.role,
    })),
  });
};

/**
 * Remove test users from the database.
 */
export const cleanUpUsers = async (userIds?: string[]) => {
  if (userIds === undefined) userIds = allTestUsers.map(user => user.userId);
  await prisma.user.deleteMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });
};
