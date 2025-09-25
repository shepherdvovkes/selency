/**
 * Logger Service
 * Provides centralized logging functionality
 */
class LoggerService {
    constructor(config) {
        this.config = config;
        this.logLevel = config.getServerConfig().environment === 'production' ? 'warn' : 'debug';
    }

    /**
     * Log debug message
     * @param {string} message - Log message
     * @param {Object} meta - Additional metadata
     */
    debug(message, meta = {}) {
        if (this.shouldLog('debug')) {
            console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
        }
    }

    /**
     * Log info message
     * @param {string} message - Log message
     * @param {Object} meta - Additional metadata
     */
    info(message, meta = {}) {
        if (this.shouldLog('info')) {
            console.info(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
        }
    }

    /**
     * Log warning message
     * @param {string} message - Log message
     * @param {Object} meta - Additional metadata
     */
    warn(message, meta = {}) {
        if (this.shouldLog('warn')) {
            console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
        }
    }

    /**
     * Log error message
     * @param {string} message - Log message
     * @param {Object} meta - Additional metadata
     */
    error(message, meta = {}) {
        if (this.shouldLog('error')) {
            console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta);
        }
    }

    /**
     * Check if should log at given level
     * @param {string} level - Log level
     * @returns {boolean} Should log
     */
    shouldLog(level) {
        const levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };

        return levels[level] >= levels[this.logLevel];
    }

    /**
     * Create child logger with context
     * @param {Object} context - Logger context
     * @returns {Object} Child logger
     */
    child(context) {
        return {
            debug: (message, meta = {}) => this.debug(message, { ...context, ...meta }),
            info: (message, meta = {}) => this.info(message, { ...context, ...meta }),
            warn: (message, meta = {}) => this.warn(message, { ...context, ...meta }),
            error: (message, meta = {}) => this.error(message, { ...context, ...meta })
        };
    }
}

module.exports = LoggerService;
