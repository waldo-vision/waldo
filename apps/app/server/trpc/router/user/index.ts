import { router } from '../../trpc';
import blacklist from './blacklist';
import deleteRoute from './delete';
export const userRouter = router({
  blacklist,
  delete: deleteRoute,
});
