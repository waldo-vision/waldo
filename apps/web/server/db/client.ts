import * as Sentry from '@sentry/nextjs';
import { PrismaClient } from 'database';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      { level: 'warn', emit: 'event' },
      { level: 'info', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
    // process.env.NODE_ENV === 'development'
    //   ? ['query', 'error', 'warn']
    //   : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
prisma.$on('query', e => {
  if (process.env.NODE_ENV === 'development') {
    Sentry.addBreadcrumb({
      category: 'prisma',
      level: 'debug',
      data: e,
    });
    console.log(e);
  }
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
prisma.$on('info', e => {
  Sentry.addBreadcrumb({
    category: 'prisma',
    level: 'log',
    data: e,
  });
  console.log(e);
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
prisma.$on('warn', e => {
  Sentry.captureException(e, {
    tags: {
      prisma: 'warn',
    },
  });
  console.log(e);
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
prisma.$on('error', e => {
  Sentry.captureException(e, {
    tags: {
      prisma: 'error',
    },
  });
  console.log(e);
});

const sentryClient = Sentry.getCurrentHub().getClient();

if (sentryClient !== undefined && sentryClient.addIntegration !== undefined)
  sentryClient.addIntegration(
    new Sentry.Integrations.Prisma({ client: prisma }),
  );
