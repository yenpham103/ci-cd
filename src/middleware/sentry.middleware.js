const Sentry = require('@sentry/node');
const { SENTRY_DSN } = process.env;

const SentryInit = () => {
    return Sentry.init({
        dsn: SENTRY_DSN,
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
    });
};

const sentrySendError = (err, ctx) => {
    Sentry.withScope((scope) => {
        scope.addEventProcessor((event) => {
            return Sentry.addRequestDataToEvent(event, ctx.request);
        });
        Sentry.captureException(err);
    });
};

module.exports = {
    SentryInit,
    sentrySendError,
};
