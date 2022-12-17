import { router } from '../trpc';
import { gameplayRouter } from './gameplay';
import { userRouter } from './user';
import { utilRouter } from './util';

export const appRouter = router({
  gameplay: gameplayRouter,
  user: userRouter,
  util: utilRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
