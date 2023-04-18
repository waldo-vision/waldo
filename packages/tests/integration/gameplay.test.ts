import { TRPCClientError } from '@trpc/client';

import { CheatTypes, GameplayTypes } from 'web/utils/zod/gameplay';

import { adminClient, basicClient, noAuthClient } from '../utils/trpc';
import { cleanUpClips } from '../utils/db';
import { cleanUpUsers, setUpUsers, testUserMod } from '../utils/users';

const gameplayInput1 = {
  youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  gameplayType: GameplayTypes.Enum.CSG,
  cheats: [CheatTypes.Enum.NOCHEAT],
  tsToken: 'mytoken',
};

/**
 * Standup and teardown before and after tests are run.
 */
beforeAll(async () => {
  await setUpUsers();
});

var clipIds: string[] = [];
afterAll(async () => {
  await cleanUpClips(clipIds);
  await cleanUpUsers();
});

/**
 * Test all the basic CRUD operations for a Gameplay object.
 */
describe('gameplay CRUD', () => {
  let gameplayId = '';
  test('create', async () => {
    const res = await basicClient.gameplay.create.mutate({ ...gameplayInput1 });

    gameplayId = res.id;
    expect(res.id.length).toBeGreaterThan(0);
    expect(res.gameplayType).toEqual(gameplayInput1.gameplayType);
    expect(res.cheats).toEqual(gameplayInput1.cheats);
    expect(res.isAnalyzed).toEqual(false);
  });

  test('get', async () => {
    const res = await basicClient.gameplay.get.query({ gameplayId });

    expect(res.id).toEqual(gameplayId);
    expect(res.gameplayType).toEqual(gameplayInput1.gameplayType);
    expect(res.cheats).toEqual(gameplayInput1.cheats);
  });

  test('update', async () => {
    const newGameplayType = GameplayTypes.Enum.COD;
    const res = await basicClient.gameplay.update.mutate({
      gameplayId,
      isAnalyzed: true,
      gameplayType: newGameplayType,
    });

    expect(res.id).toEqual(gameplayId);
    expect(res.gameplayType).toEqual(newGameplayType);
    expect(res.isAnalyzed).toEqual(true);
  });

  test('delete', async () => {
    await basicClient.gameplay.delete.mutate({
      gameplayId,
    });
  });

  test('get', async () => {
    expect.assertions(2);
    try {
      await basicClient.gameplay.get.query({ gameplayId });
    } catch (ex) {
      expect(ex instanceof TRPCClientError).toEqual(true);
      if (ex instanceof TRPCClientError)
        expect(ex.data.code).toEqual('NOT_FOUND');
    }
  });
});

/**
 * Check alternative query methods
 */
describe('gameplay query many', () => {
  const numUploads = 5;
  let gameplayIds: string[] = [];

  test('create', async () => {
    for (const [_, gameplayType] of Object.entries(GameplayTypes.Enum)) {
      const res = await basicClient.gameplay.create.mutate({
        ...gameplayInput1,
        youtubeUrl: gameplayInput1.youtubeUrl + gameplayType,
        gameplayType,
      });
      gameplayIds.push(res.id);
    }
  });

  // Check that basic users cannot query many gameplay clips
  test('getMany (insufficient perms)', async () => {
    expect.assertions(2);
    try {
      await basicClient.gameplay.getMany.query({
        page: 1,
        filterGames: null,
      });
    } catch (ex) {
      expect(ex instanceof TRPCClientError).toEqual(true);
      if (ex instanceof TRPCClientError)
        expect(ex.data.code).toEqual('UNAUTHORIZED');
    }
  });

  test('getMany (all games)', async () => {
    let res = await adminClient.gameplay.getMany.query({
      page: 1,
      filterGames: null,
    });

    expect(res[0].gameplayCount).toBeGreaterThan(0);
  });

  test('getMany (one game)', async () => {
    const gameplayType = GameplayTypes.Enum.APE;
    let res = await adminClient.gameplay.getMany.query({
      page: 1,
      filterGames: gameplayType,
    });

    const count = res[0].gameplayCount;
    expect(count).toBeGreaterThan(0);

    // Create additional gameplay
    await basicClient.gameplay.create.mutate({
      ...gameplayInput1,
      youtubeUrl: gameplayInput1.youtubeUrl + gameplayType + 'extra',
      gameplayType,
    });

    // Check that we can see the new gameplay
    res = await adminClient.gameplay.getMany.query({
      page: 1,
      filterGames: gameplayType,
    });

    expect(res[0].gameplayCount).toEqual(count + 1);
  });

  test('getUsers (own)', async () => {
    let res = await basicClient.gameplay.getUsers.query({
      userId: null,
    });

    expect(res.length).toBeGreaterThan(0);
  });

  test('getUsers (bad auth)', async () => {
    expect.assertions(2);
    try {
      await basicClient.gameplay.getUsers.query({ userId: testUserMod.userId });
    } catch (ex) {
      expect(ex instanceof TRPCClientError).toEqual(true);
      if (ex instanceof TRPCClientError)
        expect(ex.data.code).toEqual('UNAUTHORIZED');
    }
  });

  test('getClips', async () => {
    const gameplayId = gameplayIds[0];
    // Create a clip for this gameplay
    const clip = await adminClient.clip.create.mutate({
      gameplayId,
    });

    // Query clips
    let res = await adminClient.gameplay.getClips.query({
      gameplayId,
    });

    clipIds.push(clip.id);

    expect(res.length).toEqual(1);
  });
});

/**
 * Check that gameplay endpoints are protected from unauthenticated requests.
 */
describe('gameplay auth protection', () => {
  const gameplayId = 'blankId';

  const assertUnauthorized = (ex: any) => {
    expect(ex instanceof TRPCClientError).toEqual(true);
    if (ex instanceof TRPCClientError)
      expect(ex.data.code).toEqual('UNAUTHORIZED');
  };

  test('get', async () => {
    expect.assertions(2);
    try {
      await noAuthClient.gameplay.get.query({ gameplayId });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('getMany', async () => {
    expect.assertions(2);
    try {
      await noAuthClient.gameplay.getMany.query({ page: 1 });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('create', async () => {
    expect.assertions(2);
    try {
      await noAuthClient.gameplay.create.mutate({ ...gameplayInput1 });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('getUsers', async () => {
    expect.assertions(2);
    try {
      await noAuthClient.gameplay.getUsers.query({ userId: 'myUser' });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('getClips', async () => {
    expect.assertions(2);
    try {
      await noAuthClient.gameplay.getClips.query({ gameplayId });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('update', async () => {
    expect.assertions(2);
    try {
      await noAuthClient.gameplay.update.mutate({
        gameplayId,
        isAnalyzed: true,
      });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('delete', async () => {
    expect.assertions(2);
    try {
      await noAuthClient.gameplay.delete.mutate({ gameplayId });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('getReviewItems', async () => {
    expect.assertions(2);
    try {
      await noAuthClient.gameplay.getReviewItems.query({ tsToken: '' });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });

  test('review', async () => {
    expect.assertions(2);
    try {
      await noAuthClient.gameplay.review.mutate({
        gameplayId,
        isGame: true,
        actualGame: GameplayTypes.Enum.APE,
        tsToken: '',
      });
    } catch (ex) {
      assertUnauthorized(ex);
    }
  });
});
