const path = require('path');

const supportedLogLevels = process.env.SUPPORTED_LOG_LEVELS ? process.env.SUPPORTED_LOG_LEVELS.split(',') : [];

const LOGGER_LEVEL = {
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
    ERROR: 'error',
};

function buildLog(file, func, level, message, user, domain, theme, asset) {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
    const time = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
    const log = {
        event: `[${path.basename(file)}]${func}`,
        level: level,
        user,
        message: message,
        shop: domain,
        theme,
        asset,
        time: `${date} ${time}`,
    };
    return JSON.stringify(log);
}

function error(file, message, user, domain, theme, asset) {
    if (supportedLogLevels.includes(LOGGER_LEVEL.ERROR)) {
        const func = error.caller.name;
        console.error(buildLog(file, func, LOGGER_LEVEL.ERROR, message, user, domain, theme, asset));
    }
}

function debug(file, message, user, domain, theme, asset) {
    if (supportedLogLevels.includes(LOGGER_LEVEL.DEBUG)) {
        const func = debug.caller.name;
        console.debug(buildLog(file, func, LOGGER_LEVEL.DEBUG, message, user, domain, theme, asset));
    }
}

function info(file, message, user, domain, theme, asset) {
    if (supportedLogLevels.includes(LOGGER_LEVEL.INFO)) {
        const func = info.caller.name;
        console.info(buildLog(file, func, LOGGER_LEVEL.INFO, message, user, domain, theme, asset));
    }
}

function warn(file, message, user, domain, theme, asset) {
    if (supportedLogLevels.includes(LOGGER_LEVEL.WARN)) {
        const func = warn.caller.name;
        console.warn(buildLog(file, func, LOGGER_LEVEL.WARN, message, user, domain, theme, asset));
    }
}

module.exports = {
    debug,
    error,
    info,
    warn,
};
