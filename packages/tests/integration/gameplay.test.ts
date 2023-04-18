import { TRPCClientError } from '@trpc/client';

import { CheatTypes, GameplayTypes } from 'web/utils/zod/gameplay';

import { basicClient } from '../utils/trpc';
import { cleanUpUsers, setUpUsers } from '../utils/users';

const gameplayInput1 = {
  youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  gameplayType: GameplayTypes.Enum.CSG,
  cheats: [CheatTypes.Enum.NOCHEAT],
  tsToken: 'mytoken',
};

// One-time setup
beforeAll(async () => {
  await setUpUsers();
});

// Tear down after all tests are run
afterAll(async () => {
  await cleanUpUsers();
});

// Check full CRUD pipeline for one gameplay item
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
