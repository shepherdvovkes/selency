/**
 * Database Constants
 * Centralized database configuration constants
 */
const DATABASE = {
    DEFAULT_PORT: 5432,
    DEFAULT_HOST: 'localhost',
    DEFAULT_DB: 'school_mgmt',
    DEFAULT_USER: 'vovkes',
    DEFAULT_PASSWORD: '',
    DEFAULT_SSL: false,
    POOL: {
        MIN: 2,
        MAX: 10,
        IDLE: 10000
    }
};

/**
 * Database connection string template
 */
const CONNECTION_STRING_TEMPLATE = 'postgresql://{user}@{host}:{port}/{database}';

/**
 * Build connection string
 * @param {Object} config - Database configuration
 * @returns {string} Connection string
 */
function buildConnectionString(config) {
    const {
        user = DATABASE.DEFAULT_USER,
        host = DATABASE.DEFAULT_HOST,
        port = DATABASE.DEFAULT_PORT,
        database = DATABASE.DEFAULT_DB,
        password = DATABASE.DEFAULT_PASSWORD
    } = config;

    if (password) {
        return `postgresql://${user}:${password}@${host}:${port}/${database}`;
    }
    
    return `postgresql://${user}@${host}:${port}/${database}`;
}

/**
 * Get default database configuration
 * @returns {Object} Default database configuration
 */
function getDefaultConfig() {
    return {
        host: DATABASE.DEFAULT_HOST,
        port: DATABASE.DEFAULT_PORT,
        database: DATABASE.DEFAULT_DB,
        user: DATABASE.DEFAULT_USER,
        password: DATABASE.DEFAULT_PASSWORD,
        ssl: DATABASE.DEFAULT_SSL,
        pool: DATABASE.POOL
    };
}

module.exports = {
    DATABASE,
    CONNECTION_STRING_TEMPLATE,
    buildConnectionString,
    getDefaultConfig
};
