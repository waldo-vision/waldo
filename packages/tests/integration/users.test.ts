import { adminClient } from '../utils/trpc';

describe('user.GetUsers', () => {
  test('works', async () => {
    await adminClient.user.getUsers.query({
      page: 1,
    });
  });
});
