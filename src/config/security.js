/**
 * Security Configuration
 * Implements OWASP security best practices
 */
const config = require('./application');

class SecurityConfig {
    constructor() {
        this.loadSecurityConfig();
    }

    loadSecurityConfig() {
        // Rate limiting configuration
        this.rateLimit = {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
            max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requests per window
            skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS === 'true' || false,
            skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED === 'true' || false
        };

        // Account lockout configuration
        this.accountLockout = {
            maxAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
            lockoutTime: parseInt(process.env.LOCKOUT_TIME_MS) || 15 * 60 * 1000, // 15 minutes
            resetTime: parseInt(process.env.RESET_TIME_MS) || 24 * 60 * 60 * 1000 // 24 hours
        };

        // Password complexity requirements
        this.passwordPolicy = {
            minLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
            requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true' || true,
            requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE === 'true' || true,
            requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS === 'true' || true,
            requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL === 'true' || true,
            maxLength: parseInt(process.env.PASSWORD_MAX_LENGTH) || 128,
            preventCommonPasswords: process.env.PASSWORD_PREVENT_COMMON === 'true' || true
        };

        // Session configuration
        this.session = {
            maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours
            secure: process.env.SESSION_SECURE === 'true' || config.server.environment === 'production',
            httpOnly: process.env.SESSION_HTTP_ONLY === 'true' || true,
            sameSite: process.env.SESSION_SAME_SITE || 'strict'
        };

        // CORS configuration
        this.cors = {
            origin: process.env.CORS_ORIGIN || config.server.cors.origin,
            credentials: process.env.CORS_CREDENTIALS === 'true' || true,
            methods: process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,OPTIONS',
            allowedHeaders: process.env.CORS_HEADERS || 'Content-Type,Authorization,X-CSRF-Token',
            maxAge: parseInt(process.env.CORS_MAX_AGE) || 86400 // 24 hours
        };

        // Security headers configuration
        this.headers = {
            contentSecurityPolicy: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"]
            },
            hsts: {
                maxAge: parseInt(process.env.HSTS_MAX_AGE) || 31536000, // 1 year
                includeSubDomains: process.env.HSTS_INCLUDE_SUBDOMAINS === 'true' || true,
                preload: process.env.HSTS_PRELOAD === 'true' || true
            }
        };

        // Input validation configuration
        this.validation = {
            maxStringLength: parseInt(process.env.MAX_STRING_LENGTH) || 1000,
            maxArrayLength: parseInt(process.env.MAX_ARRAY_LENGTH) || 100,
            maxObjectDepth: parseInt(process.env.MAX_OBJECT_DEPTH) || 10,
            sanitizeInput: process.env.SANITIZE_INPUT === 'true' || true,
            escapeHtml: process.env.ESCAPE_HTML === 'true' || true
        };

        // Logging configuration
        this.logging = {
            logLevel: process.env.LOG_LEVEL || 'info',
            logSecurityEvents: process.env.LOG_SECURITY_EVENTS === 'true' || true,
            logFailedLogins: process.env.LOG_FAILED_LOGINS === 'true' || true,
            logDataAccess: process.env.LOG_DATA_ACCESS === 'true' || true,
            logSuspiciousActivity: process.env.LOG_SUSPICIOUS_ACTIVITY === 'true' || true,
            logRetentionDays: parseInt(process.env.LOG_RETENTION_DAYS) || 30
        };

        // API security configuration
        this.api = {
            version: process.env.API_VERSION || 'v1',
            requireApiKey: process.env.REQUIRE_API_KEY === 'true' || false,
            apiKeyHeader: process.env.API_KEY_HEADER || 'X-API-Key',
            maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
            timeout: parseInt(process.env.API_TIMEOUT) || 30000 // 30 seconds
        };

        // Database security configuration
        this.database = {
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
            queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 30000, // 30 seconds
            encryptConnections: process.env.DB_ENCRYPT_CONNECTIONS === 'true' || false,
            requireSSL: process.env.DB_REQUIRE_SSL === 'true' || config.server.environment === 'production'
        };
    }

    /**
     * Validate security configuration
     */
    validateConfig() {
        const errors = [];

        // Validate rate limiting
        if (this.rateLimit.windowMs < 60000) { // Minimum 1 minute
            errors.push('Rate limit window must be at least 1 minute');
        }

        if (this.rateLimit.max < 1) {
            errors.push('Rate limit max must be at least 1');
        }

        // Validate account lockout
        if (this.accountLockout.maxAttempts < 1) {
            errors.push('Max login attempts must be at least 1');
        }

        if (this.accountLockout.lockoutTime < 60000) { // Minimum 1 minute
            errors.push('Lockout time must be at least 1 minute');
        }

        // Validate password policy
        if (this.passwordPolicy.minLength < 8) {
            errors.push('Password minimum length must be at least 8');
        }

        if (this.passwordPolicy.maxLength < this.passwordPolicy.minLength) {
            errors.push('Password maximum length must be greater than minimum length');
        }

        // Validate session configuration
        if (this.session.maxAge < 3600000) { // Minimum 1 hour
            errors.push('Session max age must be at least 1 hour');
        }

        // Validate CORS configuration
        if (!this.cors.origin) {
            errors.push('CORS origin must be specified');
        }

        // Validate logging configuration
        if (this.logging.logRetentionDays < 1) {
            errors.push('Log retention days must be at least 1');
        }

        if (errors.length > 0) {
            throw new Error(`Security configuration validation failed: ${errors.join(', ')}`);
        }

        return true;
    }

    /**
     * Get security configuration for specific environment
     */
    getEnvironmentConfig() {
        const env = config.server.environment;
        
        switch (env) {
            case 'production':
                return {
                    rateLimit: { ...this.rateLimit, max: Math.min(this.rateLimit.max, 50) },
                    accountLockout: { ...this.accountLockout, maxAttempts: Math.min(this.accountLockout.maxAttempts, 3) },
                    session: { ...this.session, secure: true, httpOnly: true },
                    cors: { ...this.cors, credentials: true },
                    logging: { ...this.logging, logLevel: 'warn' }
                };
            
            case 'development':
                return {
                    rateLimit: { ...this.rateLimit, max: 1000 },
                    accountLockout: { ...this.accountLockout, maxAttempts: 10 },
                    session: { ...this.session, secure: false },
                    cors: { ...this.cors, credentials: true },
                    logging: { ...this.logging, logLevel: 'debug' }
                };
            
            case 'test':
                return {
                    rateLimit: { ...this.rateLimit, max: 10000 },
                    accountLockout: { ...this.accountLockout, maxAttempts: 100 },
                    session: { ...this.session, secure: false },
                    cors: { ...this.cors, credentials: true },
                    logging: { ...this.logging, logLevel: 'error' }
                };
            
            default:
                return this;
        }
    }

    /**
     * Get security headers configuration
     */
    getSecurityHeaders() {
        return {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
            'Strict-Transport-Security': `max-age=${this.headers.hsts.maxAge}; includeSubDomains; preload`
        };
    }
}

module.exports = new SecurityConfig();
