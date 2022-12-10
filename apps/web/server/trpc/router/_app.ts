import { router } from '../trpc';
import { gameplayRouter } from './gameplay';
import { userRouter } from './user';

export const appRouter = router({
  gameplay: gameplayRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
