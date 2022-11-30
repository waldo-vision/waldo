import { getBaseUrl } from '@utils/baseurl';
import { generateOpenApiDocument } from 'trpc-openapi';
import { appRouter } from './router/_app';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'tRPC OpenAPI',
  version: '0.0.1',
  baseUrl: getBaseUrl(),
});
