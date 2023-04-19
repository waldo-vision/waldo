import { TRPCClientError } from '@trpc/client';

import { Roles } from 'database';

import { adminClient, basicClient, noAuthClient } from '../utils/trpc';
import { cleanUpUsers, testUserBasic } from '../utils/users';
import { prisma } from '../utils/db';

const NUM_FIXTURES = 5;

/**
 * Populate database with fixtures.
 */
const fixtureUserIds = Array.from(Array(NUM_FIXTURES).keys()).map(
  i => `clglqupom00bp5s87fxip254${String.fromCharCode(75 + i).toLowerCase()}`,
);
beforeAll(async () => {
  // Create dummy users
  await prisma.user.createMany({
    data: fixtureUserIds.map(userId => ({
      id: userId,
      name: userId,
      role: Roles.USER,
    })),
  });
});

// Clean up fixtures
afterAll(async () => {
  await cleanUpUsers(fixtureUserIds);
});

/**
 * Test users endpoints.
 */
describe('user queries', () => {
  test('getUsers (all)', async () => {
    const res = await adminClient.user.getUsers.query({
      page: 1,
    });

    expect(res.userCount).toBeGreaterThan(0);
  });

  test('getUsers (one role)', async () => {
    const res = await adminClient.user.getUsers.query({
      page: 1,
      filterRoles: Roles.USER,
    });

    expect(res.userCount).toBeGreaterThan(0);
  });

  test('search (name)', async () => {
    const users = await adminClient.user.search.query({
      name: testUserBasic.userId,
    });

    expect(users.length).toBeGreaterThan(0);
  });

  test('search (not found)', async () => {
    const users = await adminClient.user.search.query({
      name: '00000000000000000000000000000',
    });
    expect(users.length).toEqual(0);
  });

  test('search (email)', async () => {
    const users = await adminClient.user.search.query({
      name: testUserBasic.email,
    });

    expect(users.length).toBeGreaterThan(0);
  });
});

describe('user modifications', () => {
  test('blacklist', async () => {
    const userId = fixtureUserIds[0];

    // Blacklist user
    await adminClient.user.blackList.mutate({ blacklisted: true, userId });

    // Check that user is modified
    const users = await adminClient.user.search.query({ name: userId });

    expect(users.length).toBeGreaterThan(0);
    expect(users[0].id).toEqual(userId);
    expect(users[0].blacklisted).toEqual(true);
  });

  test('updateRole', async () => {
    const userId = fixtureUserIds[1];

    // Update role user
    const newRole = Roles.MOD;
    await adminClient.user.updateRole.mutate({ userId, role: newRole });

    // Check that user has been updated
    const users = await adminClient.user.search.query({ name: userId });

    expect(users.length).toBeGreaterThan(0);
    expect(users[0].id).toEqual(userId);
    expect(users[0].role).toEqual(newRole);
  });
});

/**
 * Check that user endpoints are protected from unauthenticated requests.
 */
describe('user auth protection', () => {
  const userId = fixtureUserIds[3];

  const assertUnauthorized = (ex: any) => {
    expect(ex instanceof TRPCClientError).toEqual(true);
    if (ex instanceof TRPCClientError)
      expect(ex.data.code).toEqual('UNAUTHORIZED');
  };

  test('blackList', async () => {
    expect.assertions(2);
    try {
      await basicClient.user.blackList.mutate({ userId, blacklisted: true });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('delete', async () => {
    expect.assertions(2);
    try {
      await adminClient.user.delete.mutate({ userId });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('getLinkedAccounts', async () => {
    expect.assertions(2);
    try {
      await noAuthClient.user.getLinkedAccounts.query();
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('unLinkAccount', async () => {
    expect.assertions(2);
    try {
      await adminClient.user.unlinkAccount.mutate({ accountId: userId });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('getUsers', async () => {
    expect.assertions(2);
    try {
      await basicClient.user.getUsers.query({ page: 1 });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('updateRole', async () => {
    expect.assertions(2);
    try {
      await basicClient.user.updateRole.mutate({ userId, role: Roles.MOD });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('search', async () => {
    expect.assertions(2);
    try {
      await basicClient.user.search.query({ name: userId });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });
});
