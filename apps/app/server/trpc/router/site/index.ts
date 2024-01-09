import { router } from '../../trpc';

import getPageData from './getPageData';
import getSiteData from './getSiteData';
import updatePage from './updatePage';
import updateSite from './updateSite';

export const siteRouter = router({
  getPageData,
  getSiteData,
  updatePage,
  updateSite
});