import { Roles } from 'database';
import { prisma } from './db';

interface ITestUser {
  userId: string;
  role: Roles;
}

/* A list of dumby users with different roles */
export const testUserBasic: ITestUser = {
  userId: 'clglqupom00bp5s87fxip254i',
  role: Roles.USER,
};

export const testUserTrusted: ITestUser = {
  userId: 'clglqupom00bp5s87fxip254a',
  role: Roles.TRUSTED,
};

export const testUserMod: ITestUser = {
  userId: 'clglqupom00bp5s87fxip254b',
  role: Roles.MOD,
};

export const testUserAdmin: ITestUser = {
  userId: 'clglqupom00bp5s87fxip254c',
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

/**
 * Populate the database with each of the test users.
 */
export const setUpUsers = async () => {
  await prisma.user.createMany({
    data: allTestUsers.map(user => ({
      id: user.userId,
      name: 'test user',
      role: user.role,
    })),
  });
};

/**
 * Remove test users from the database.
 */
export const cleanUpUsers = async () => {
  await prisma.user.deleteMany({
    where: {
      id: {
        in: allTestUsers.map(user => user.userId),
      },
    },
  });
};
