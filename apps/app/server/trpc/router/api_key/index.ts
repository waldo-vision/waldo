import { router } from '../../trpc';
import create from './create';
import deleteRoute from './delete';
import getUserKeys from './getUserKeys';

export const apiKeyRouter = router({
  create,
  delete: deleteRoute,
  getUserKeys,
});
