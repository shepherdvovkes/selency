// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.RESEND_API_KEY = 'test_key_re_123456789';
process.env.JWT_SECRET = 'test_jwt_secret_key';
process.env.JWT_EXPIRES_IN = '24h';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'test_school_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASSWORD = 'test_password';

// Mock email service
jest.mock('../src/utils/send-email', () => ({
    sendAccountVerificationEmail: jest.fn().mockResolvedValue({ success: true }),
    sendPasswordSetupEmail: jest.fn().mockResolvedValue({ success: true }),
    sendEmail: jest.fn().mockResolvedValue({ success: true })
}));

// Mock database connection for testing
jest.mock('../src/utils/process-db-request', () => {
    return jest.fn().mockImplementation(async ({ query, queryParams }) => {
        // Mock database responses based on query
        if (query.includes('SELECT') && query.includes('users')) {
            if (query.includes('WHERE id = $1')) {
                // Mock get student by ID
                return { rows: [{ id: 1, name: 'Test Student', email: 'test@example.com' }] };
            } else {
                // Mock get all students
                return { rows: [
                    { id: 1, name: 'Test Student 1', email: 'test1@example.com' },
                    { id: 2, name: 'Test Student 2', email: 'test2@example.com' }
                ] };
            }
        }
        
        if (query.includes('INSERT INTO users')) {
            // Mock student creation
            return { rows: [{ userId: 123, status: true, message: 'Student added successfully' }] };
        }
        
        if (query.includes('UPDATE users')) {
            // Mock student update
            return { rowCount: 1 };
        }
        
        if (query.includes('DELETE FROM users')) {
            // Mock student deletion
            return { rowCount: 1 };
        }
        
        // Default mock response
        return { rows: [], rowCount: 0 };
    });
});

const { processDBRequest } = require('../src/utils');

// Test database setup
async function setupTestDatabase() {
    try {
        console.log('Test database setup completed (mocked)');
    } catch (error) {
        console.error('Error setting up test database:', error);
        throw error;
    }
}

// Clean up test data
async function cleanupTestDatabase() {
    try {
        console.log('Test database cleanup completed (mocked)');
    } catch (error) {
        console.error('Error cleaning up test database:', error);
        throw error;
    }
}

module.exports = {
    setupTestDatabase,
    cleanupTestDatabase
};
