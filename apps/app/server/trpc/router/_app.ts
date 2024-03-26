import { router } from '../trpc';
import { apiKeyRouter } from './api_key';
import { clipRouter } from './clip';
import { gameplayRouter } from './gameplay';
import { siteRouter } from './site';
import { analysisRouter } from './analysis';
import { userRouter } from './user';

export const appRouter = router({
  gameplay: gameplayRouter,
  clip: clipRouter,
  user: userRouter,
  site: siteRouter,
  apiKey: apiKeyRouter,
  analysisApi: analysisRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
