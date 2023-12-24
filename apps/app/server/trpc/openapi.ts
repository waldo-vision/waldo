import { getBaseUrl } from '@utils/baseurl';
import { docs } from '@utils/links';
import { generateOpenApiDocument } from 'trpc-openapi';
import { appRouter } from './router/_app';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'tRPC OpenAPI',
  version: process.env.SENTRY_RELEASE || '0.0.0',
  baseUrl: `${getBaseUrl()}/api`,
  docsUrl: docs,
});
