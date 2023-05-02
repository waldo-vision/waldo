import { config, createApiHandler } from '@ory/integrations/next-edge';

export { config };

export default createApiHandler({
  fallbackToPlayground: true,
  dontUseTldForCookieDomain: true,
});
