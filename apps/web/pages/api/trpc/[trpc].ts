import { createNextApiHandler } from '@trpc/server/adapters/next';
import * as Sentry from '@sentry/nextjs';
import { createContext } from '@server/trpc/context';
import { appRouter } from '@server/trpc/router/_app';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError: ({ path, error, type }) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ tRPC failed on ${path}: ${error}`);
    } else {
      Sentry.captureException(error, scope => {
        scope.setTag('path', path);
        scope.setTag('type', type);
        return scope;
      });
    }
  },
});
