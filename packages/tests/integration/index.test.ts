/**
 * We use this file so we can determine in which order the different tests are run by
 * importing the tests in the order we want.
 *
 * This is important to ensure set-up and tear-down occur in the order we want.
 */
import { cleanUpUsers } from '../utils/users';

import './gameplay';
import './clips';

afterAll(async () => {
  await cleanUpUsers();
});
