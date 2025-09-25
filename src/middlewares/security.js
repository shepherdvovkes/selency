/**
 * Security Middleware
 * Implements OWASP security best practices
 */
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

/**
 * Rate limiting middleware
 */
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: Math.ceil(windowMs / 1000)
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            console.error(`SECURITY: Rate limit exceeded for IP ${req.ip}`);
            res.status(429).json({
                error: 'Too many requests from this IP, please try again later.',
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
    });
};

/**
 * Security headers middleware
 */
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

/**
 * Request size limiter
 */
const requestSizeLimit = (limit = '10mb') => {
    return (req, res, next) => {
        const contentLength = parseInt(req.headers['content-length'] || '0');
        const maxSize = parseInt(limit.replace('mb', '')) * 1024 * 1024;
        
        if (contentLength > maxSize) {
            console.error(`SECURITY: Request too large from IP ${req.ip}`);
            return res.status(413).json({
                error: 'Request entity too large',
                maxSize: limit
            });
        }
        
        next();
    };
};

/**
 * Security logging middleware
 */
const securityLogger = (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
        // Log security events
        if (res.statusCode >= 400) {
            console.error(`SECURITY: ${res.statusCode} response for ${req.method} ${req.path} from IP ${req.ip}`);
        }
        
        if (res.statusCode === 401) {
            console.error(`SECURITY: Unauthorized access attempt for ${req.method} ${req.path} from IP ${req.ip}`);
        }
        
        if (res.statusCode === 403) {
            console.error(`SECURITY: Forbidden access attempt for ${req.method} ${req.path} from IP ${req.ip}`);
        }
        
        originalSend.call(this, data);
    };
    
    next();
};

/**
 * Account lockout mechanism
 */
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

const checkAccountLockout = (username) => {
    const attempts = loginAttempts.get(username);
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
        const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
        if (timeSinceLastAttempt < LOCKOUT_TIME) {
            console.error(`SECURITY: Account locked for ${username} due to too many failed attempts`);
            throw new Error('Account temporarily locked due to too many failed attempts');
        } else {
            // Reset attempts after lockout time
            loginAttempts.delete(username);
        }
    }
};

const recordFailedLogin = (username, ip) => {
    const attempts = loginAttempts.get(username) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    loginAttempts.set(username, attempts);
    
    console.error(`SECURITY: Failed login attempt for ${username} from IP ${ip} (attempt ${attempts.count})`);
};

const recordSuccessfulLogin = (username) => {
    loginAttempts.delete(username);
    console.info(`SECURITY: Successful login for ${username}`);
};

/**
 * Input validation for student data
 */
const validateStudent = [
    body('name')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('email')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('phone')
        .isMobilePhone()
        .withMessage('Invalid phone number format'),
    body('dob')
        .isISO8601()
        .withMessage('Invalid date format')
        .toDate(),
    body('class')
        .isLength({ min: 1, max: 50 })
        .withMessage('Class must be between 1 and 50 characters')
        .trim()
        .escape(),
    body('section')
        .isLength({ min: 1, max: 10 })
        .withMessage('Section must be between 1 and 10 characters')
        .trim()
        .escape(),
    body('roll')
        .isInt({ min: 1, max: 9999 })
        .withMessage('Roll number must be between 1 and 9999'),
    body('gender')
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    body('systemAccess')
        .isBoolean()
        .withMessage('System access must be a boolean value')
];

/**
 * Input validation for student update
 */
const validateStudentUpdate = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters')
        .trim()
        .escape(),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Invalid phone number format'),
    body('dob')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format')
        .toDate(),
    body('class')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Class must be between 1 and 50 characters')
        .trim()
        .escape(),
    body('section')
        .optional()
        .isLength({ min: 1, max: 10 })
        .withMessage('Section must be between 1 and 10 characters')
        .trim()
        .escape(),
    body('roll')
        .optional()
        .isInt({ min: 1, max: 9999 })
        .withMessage('Roll number must be between 1 and 9999'),
    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    body('systemAccess')
        .optional()
        .isBoolean()
        .withMessage('System access must be a boolean value')
];

/**
 * Validation error handler
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(`SECURITY: Validation errors for ${req.method} ${req.path}:`, errors.array());
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

/**
 * Password complexity validation
 */
const validatePasswordComplexity = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
        return 'Password must be at least 8 characters long';
    }
    
    if (!hasUpperCase) {
        return 'Password must contain at least one uppercase letter';
    }
    
    if (!hasLowerCase) {
        return 'Password must contain at least one lowercase letter';
    }
    
    if (!hasNumbers) {
        return 'Password must contain at least one number';
    }
    
    if (!hasSpecialChar) {
        return 'Password must contain at least one special character';
    }
    
    return null;
};

module.exports = {
    createRateLimit,
    securityHeaders,
    requestSizeLimit,
    securityLogger,
    checkAccountLockout,
    recordFailedLogin,
    recordSuccessfulLogin,
    validateStudent,
    validateStudentUpdate,
    handleValidationErrors,
    validatePasswordComplexity
};
