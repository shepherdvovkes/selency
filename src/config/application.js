const { DATABASE } = require('../constants/database');
const { SERVER } = require('../constants/server');

/**
 * Application Configuration
 * Centralized configuration management with environment variable support
 */
class ApplicationConfig {
    constructor() {
        this.loadConfig();
    }

    loadConfig() {
        // Database Configuration
        this.database = {
            url: process.env.DATABASE_URL || 'postgresql://vovkes@localhost:5432/school_mgmt',
            host: process.env.DB_HOST || DATABASE.DEFAULT_HOST,
            port: process.env.DB_PORT || DATABASE.DEFAULT_PORT,
            name: process.env.DB_NAME || 'school_mgmt',
            user: process.env.DB_USER || 'vovkes',
            password: process.env.DB_PASSWORD || '',
            ssl: process.env.DB_SSL === 'true' || false,
            pool: {
                min: parseInt(process.env.DB_POOL_MIN) || 2,
                max: parseInt(process.env.DB_POOL_MAX) || 10,
                idle: parseInt(process.env.DB_POOL_IDLE) || 10000
            }
        };

        // Server Configuration
        this.server = {
            port: parseInt(process.env.PORT) || SERVER.DEFAULT_PORT,
            host: process.env.HOST || SERVER.DEFAULT_HOST,
            environment: process.env.NODE_ENV || 'development',
            cors: {
                origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
                credentials: process.env.CORS_CREDENTIALS === 'true' || true
            }
        };

        // JWT Configuration
        this.jwt = {
            accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
            refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
            accessTokenTime: parseInt(process.env.JWT_ACCESS_TOKEN_TIME_IN_MS) || 900000,
            refreshTokenTime: parseInt(process.env.JWT_REFRESH_TOKEN_TIME_IN_MS) || 28800000
        };

        // CSRF Configuration
        this.csrf = {
            secret: process.env.CSRF_TOKEN_SECRET,
            time: parseInt(process.env.CSRF_TOKEN_TIME_IN_MS) || 950000
        };

        // Email Configuration
        this.email = {
            service: process.env.EMAIL_SERVICE || 'resend',
            apiKey: process.env.RESEND_API_KEY,
            fromUser: process.env.MAIL_FROM_USER || 'test@example.com',
            verificationSecret: process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
            verificationTime: parseInt(process.env.EMAIL_VERIFICATION_TOKEN_TIME_IN_MS) || 18000000,
            passwordSetupSecret: process.env.PASSWORD_SETUP_TOKEN_SECRET,
            passwordSetupTime: parseInt(process.env.PASSWORD_SETUP_TOKEN_TIME_IN_MS) || 300000
        };

        // Application URLs
        this.urls = {
            ui: process.env.UI_URL || 'http://localhost:5173',
            api: process.env.API_URL || 'http://localhost:5007',
            cookieDomain: process.env.COOKIE_DOMAIN || 'localhost'
        };

        // Logging Configuration
        this.logging = {
            level: process.env.LOG_LEVEL || 'info',
            format: process.env.LOG_FORMAT || 'combined',
            file: process.env.LOG_FILE || null
        };

        // Feature Flags
        this.features = {
            emailVerification: process.env.FEATURE_EMAIL_VERIFICATION === 'true' || true,
            csrfProtection: process.env.FEATURE_CSRF_PROTECTION === 'true' || true,
            rateLimiting: process.env.FEATURE_RATE_LIMITING === 'true' || false,
            caching: process.env.FEATURE_CACHING === 'true' || false
        };
    }

    /**
     * Get database configuration
     * @returns {Object} Database configuration
     */
    getDatabaseConfig() {
        return this.database;
    }

    /**
     * Get server configuration
     * @returns {Object} Server configuration
     */
    getServerConfig() {
        return this.server;
    }

    /**
     * Get JWT configuration
     * @returns {Object} JWT configuration
     */
    getJWTConfig() {
        return this.jwt;
    }

    /**
     * Get email configuration
     * @returns {Object} Email configuration
     */
    getEmailConfig() {
        return this.email;
    }

    /**
     * Get feature flags
     * @returns {Object} Feature flags
     */
    getFeatureFlags() {
        return this.features;
    }

    /**
     * Check if feature is enabled
     * @param {string} feature - Feature name
     * @returns {boolean} Feature enabled status
     */
    isFeatureEnabled(feature) {
        return this.features[feature] || false;
    }

    /**
     * Get all configuration
     * @returns {Object} Complete configuration
     */
    getAllConfig() {
        return {
            database: this.database,
            server: this.server,
            jwt: this.jwt,
            csrf: this.csrf,
            email: this.email,
            urls: this.urls,
            logging: this.logging,
            features: this.features
        };
    }

    /**
     * Validate configuration
     * @returns {Object} Validation result
     */
    validate() {
        const errors = [];

        // Required environment variables
        const required = [
            'DATABASE_URL',
            'JWT_ACCESS_TOKEN_SECRET',
            'JWT_REFRESH_TOKEN_SECRET',
            'CSRF_TOKEN_SECRET',
            'RESEND_API_KEY',
            'EMAIL_VERIFICATION_TOKEN_SECRET',
            'PASSWORD_SETUP_TOKEN_SECRET'
        ];

        required.forEach(key => {
            if (!process.env[key]) {
                errors.push(`Missing required environment variable: ${key}`);
            }
        });

        // Validate database URL format
        if (this.database.url && !this.database.url.startsWith('postgresql://')) {
            errors.push('Invalid database URL format');
        }

        // Validate port numbers
        if (this.server.port < 1 || this.server.port > 65535) {
            errors.push('Invalid server port number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// Create singleton instance
const config = new ApplicationConfig();

module.exports = config;
