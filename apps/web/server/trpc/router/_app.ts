import { router } from '../trpc';
import { gameplayRouter } from './gameplay';

export const appRouter = router({
  gameplay: gameplayRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
