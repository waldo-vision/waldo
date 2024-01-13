import { router } from '../../trpc';
import create from './create';
import deleteRoute from './delete';
import get from './get';
import getClips from './getClips';
import getMany from './getMany';
import getReviewItems from './getReviewItems';
import getUsers from './getUsers';
import review from './review';
import update from './update';

export const gameplayRouter = router({
  create,
  delete: deleteRoute,
  get,
  getClips,
  getMany,
  getReviewItems,
  getUsers, 
  review,
  update
});