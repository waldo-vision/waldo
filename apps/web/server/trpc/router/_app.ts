import { router } from '../trpc';
import { clipRouter } from './clip';
import { gameplayRouter } from './gameplay';

export const appRouter = router({
  gameplay: gameplayRouter,
  clip: clipRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
