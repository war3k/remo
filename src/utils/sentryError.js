import * as Sentry from '@sentry/browser';

export const sentryErrorSend = (request, error) => {
  Sentry.withScope(scope => {
    scope.setExtra('error', { request, error: error.response });
    Sentry.captureException(new Error('Bad Request'));
  });
};
