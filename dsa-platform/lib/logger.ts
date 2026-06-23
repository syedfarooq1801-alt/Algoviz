// Central error logger. Single place to forward to an external service later
// (e.g. Sentry: add `Sentry.captureException(error)` here once a DSN is set).
export function logError(error: unknown, context?: Record<string, unknown>) {
  const err = error instanceof Error ? error : new Error(String(error));
  // Structured console output — picked up by Vercel logs / browser console.
  console.error("[app-error]", {
    message: err.message,
    stack: err.stack,
    ...context,
  });
  // TODO: forward to Sentry/Logtail/etc. when a DSN is configured:
  // Sentry.captureException(err, { extra: context });
}
