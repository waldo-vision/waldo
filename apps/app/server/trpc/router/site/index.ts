import { router, protectedProcedure, publicProcedure } from '../../trpc';

import getPageData from './getPageData';

export const siteRouter = router({
  getPageData
});