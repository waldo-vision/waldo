import { router } from '../../trpc';
import getUrls from './getUrls';

export const analysisRouter = router({
  getUrls,
});
