import { createOpenApiNextHandler } from 'trpc-openapi';

import { appRouter } from '@server/trpc/router/_app';
import { createContext } from '@server/trpc/context';

export default createOpenApiNextHandler({ router: appRouter, createContext });
