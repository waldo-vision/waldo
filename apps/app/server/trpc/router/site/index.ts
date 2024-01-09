import { router, protectedProcedure, publicProcedure } from '../../trpc';

import getPageData from './getPageData';
import getSiteData from './getSiteData';
import updatePage from './updatePage';

export const siteRouter = router({
  getPageData,
  getSiteData,
  updatePage,
});