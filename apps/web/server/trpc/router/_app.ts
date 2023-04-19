import { router } from '../trpc';
import { apiKeyRouter } from './apikeys';
import { clipRouter } from './clip';
import { gameplayRouter } from './gameplay';
import { siteRouter } from './site';
import { analysisApiRouter } from './analysisApi';
import { userRouter } from './user';
import { utilRouter } from './util';

export const appRouter = router({
  gameplay: gameplayRouter,
  clip: clipRouter,
  user: userRouter,
  util: utilRouter,
  site: siteRouter,
  apiKey: apiKeyRouter,
  analysisApi: analysisApiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
