// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever middleware or an Edge route handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import {
  ExtraErrorData,
  CaptureConsole,
  ReportingObserver,
} from '@sentry/integrations';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  release: process.env.SENTRY_RELEASE,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.5,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps

  beforeSend(event) {
    if (event.user) {
      // Don't send user's personal information to Sentry
      delete event.user.email;
      delete event.user.ip_address;
      delete event.user.username;
    }
    return event;
  },
  integrations: [
    // collect extra error data
    new ExtraErrorData({
      // Limit of how deep the object serializer should go. Anything deeper than limit will
      // be replaced with standard Node.js REPL notation of [Object], [Array], [Function] or
      // a primitive value. Defaults to 3.
      // depth: number,
    }),
    // capture console logs as breadcrumbs
    new CaptureConsole({
      // array of methods that should be captured
      // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
      // levels: string[];
    }),
    // capture reporting API errors
    // https://developer.mozilla.org/en-US/docs/Web/API/ReportingObserver
    new ReportingObserver({
      // types: <'crash'|'deprecation'|'intervention'>[];
    }),
  ],
});
