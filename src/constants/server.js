/**
 * Server Constants
 * Centralized server configuration constants
 */
const SERVER = {
    DEFAULT_PORT: 5007,
    DEFAULT_HOST: 'localhost',
    DEFAULT_ENVIRONMENT: 'development',
    CORS: {
        DEFAULT_ORIGIN: 'http://localhost:5173',
        DEFAULT_CREDENTIALS: true
    }
};

/**
 * Environment types
 */
const ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
    STAGING: 'staging'
};

/**
 * Get default server configuration
 * @returns {Object} Default server configuration
 */
function getDefaultConfig() {
    return {
        port: SERVER.DEFAULT_PORT,
        host: SERVER.DEFAULT_HOST,
        environment: SERVER.DEFAULT_ENVIRONMENT,
        cors: SERVER.CORS
    };
}

/**
 * Check if environment is production
 * @param {string} env - Environment
 * @returns {boolean} Is production
 */
function isProduction(env) {
    return env === ENVIRONMENTS.PRODUCTION;
}

/**
 * Check if environment is development
 * @param {string} env - Environment
 * @returns {boolean} Is development
 */
function isDevelopment(env) {
    return env === ENVIRONMENTS.DEVELOPMENT;
}

/**
 * Check if environment is test
 * @param {string} env - Environment
 * @returns {boolean} Is test
 */
function isTest(env) {
    return env === ENVIRONMENTS.TEST;
}

module.exports = {
    SERVER,
    ENVIRONMENTS,
    getDefaultConfig,
    isProduction,
    isDevelopment,
    isTest
};
