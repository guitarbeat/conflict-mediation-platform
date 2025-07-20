// * Centralized logging utility for improved debugging

const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4,
};

const LOG_NAMES = {
    0: 'ERROR',
    1: 'WARN',
    2: 'INFO',
    3: 'DEBUG',
    4: 'TRACE',
};

class Logger {
    constructor() {
        this.level = this.getLogLevel();
        this.isDevelopment = import.meta.env.DEV;
        this.logHistory = [];
        this.maxHistorySize = 1000;
    }

    getLogLevel() {
        // * Allow override via localStorage for debugging
        const storedLevel = localStorage.getItem('logLevel');
        if (storedLevel !== null) {
            return parseInt(storedLevel, 10);
        }

        // * Default to DEBUG in development, WARN in production
        return this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;
    }

    shouldLog(level) {
        return level <= this.level;
    }

    formatMessage(level, context, message, data) {
        const timestamp = new Date().toISOString();
        const levelName = LOG_NAMES[level];
        const contextStr = context ? `[${context}]` : '';

        return {
            timestamp,
            level: levelName,
            context,
            message,
            data,
            fullMessage: `${timestamp} ${levelName} ${contextStr} ${message}`,
        };
    }

    addToHistory(logEntry) {
        this.logHistory.push(logEntry);
        if (this.logHistory.length > this.maxHistorySize) {
            this.logHistory.shift();
        }
    }

    log(level, context, message, data = null) {
        if (!this.shouldLog(level)) return;

        const logEntry = this.formatMessage(level, context, message, data);
        this.addToHistory(logEntry);

        // * Console output with appropriate styling
        const consoleMethod = level === LOG_LEVELS.ERROR ? 'error' :
            level === LOG_LEVELS.WARN ? 'warn' :
                level === LOG_LEVELS.INFO ? 'info' :
                    'log';

        if (data) {
            console[consoleMethod](logEntry.fullMessage, data);
        } else {
            console[consoleMethod](logEntry.fullMessage);
        }
    }

    error(context, message, error = null) {
        this.log(LOG_LEVELS.ERROR, context, message, error);
    }

    warn(context, message, data = null) {
        this.log(LOG_LEVELS.WARN, context, message, data);
    }

    info(context, message, data = null) {
        this.log(LOG_LEVELS.INFO, context, message, data);
    }

    debug(context, message, data = null) {
        this.log(LOG_LEVELS.DEBUG, context, message, data);
    }

    trace(context, message, data = null) {
        this.log(LOG_LEVELS.TRACE, context, message, data);
    }

    // * Performance logging
    time(context, label) {
        if (this.shouldLog(LOG_LEVELS.DEBUG)) {
            console.time(`${context}:${label}`);
        }
    }

    timeEnd(context, label) {
        if (this.shouldLog(LOG_LEVELS.DEBUG)) {
            console.timeEnd(`${context}:${label}`);
        }
    }

    // * Debug utilities
    getLogHistory() {
        return [...this.logHistory];
    }

    clearLogHistory() {
        this.logHistory = [];
    }

    exportLogs() {
        return JSON.stringify(this.logHistory, null, 2);
    }

    // * Error boundary helper
    captureError(error, context, additionalInfo = {}) {
        this.error(context, 'Error captured', {
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name,
            },
            ...additionalInfo,
        });
    }
}

// * Create singleton instance
const logger = new Logger();

// * Development-only global access for debugging
if (import.meta.env.DEV) {
    window.logger = logger;
    window.LOG_LEVELS = LOG_LEVELS;

    // * Allow runtime log level changes
    window.setLogLevel = (level) => {
        localStorage.setItem('logLevel', level.toString());
        logger.level = level;
        logger.info('Logger', `Log level changed to ${LOG_NAMES[level]}`);
    };
}

export default logger;
export { LOG_LEVELS }; 