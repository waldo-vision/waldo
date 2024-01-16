import { router } from '../../trpc';
import create from './create';
import deleteRoute from './delete';
import get from './get';

export const clipRouter = router({
  create,
  delete: deleteRoute,
  get,
});
