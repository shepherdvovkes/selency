/**
 * Test Data Fixtures
 * Centralized test data to avoid hardcoded values in tests
 */
const TEST_DATA = {
    // Admin user for testing
    ADMIN_USER: {
        id: 1,
        name: 'John Doe',
        email: 'admin@school-admin.com',
        password: '3OU4zn3q6Zh9',
        role: 'admin',
        isActive: true
    },

    // Student user for testing
    STUDENT_USER: {
        id: 2,
        name: 'Test Student',
        email: 'student@test.com',
        password: 'password123',
        role: 'student',
        isActive: true
    },

    // Staff user for testing
    STAFF_USER: {
        id: 3,
        name: 'Test Staff',
        email: 'staff@test.com',
        password: 'password123',
        role: 'staff',
        isActive: true
    },

    // Sample student data
    SAMPLE_STUDENT: {
        name: 'Sample Student',
        email: 'sample.student@test.com',
        gender: 'Male',
        phone: '1234567890',
        dob: '2005-01-01',
        systemAccess: true,
        class: 'Grade 10',
        section: 'A',
        roll: 1001
    },

    // Sample class data
    SAMPLE_CLASSES: [
        { name: 'Grade 10', sections: 'A,B' },
        { name: 'Grade 11', sections: 'A,B' },
        { name: 'Grade 12', sections: 'A,B' }
    ],

    // Sample sections
    SAMPLE_SECTIONS: [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' }
    ],

    // Test database configuration
    TEST_DB_CONFIG: {
        host: 'localhost',
        port: 5432,
        database: 'test_school_mgmt',
        user: 'vovkes',
        password: ''
    },

    // Test server configuration
    TEST_SERVER_CONFIG: {
        port: 5008,
        host: 'localhost',
        environment: 'test'
    }
};

/**
 * Get test user by role
 * @param {string} role - User role
 * @returns {Object} Test user data
 */
function getTestUser(role) {
    const userMap = {
        'admin': TEST_DATA.ADMIN_USER,
        'student': TEST_DATA.STUDENT_USER,
        'staff': TEST_DATA.STAFF_USER
    };
    
    return userMap[role.toLowerCase()];
}

/**
 * Get test student data
 * @param {Object} overrides - Data overrides
 * @returns {Object} Test student data
 */
function getTestStudent(overrides = {}) {
    return {
        ...TEST_DATA.SAMPLE_STUDENT,
        ...overrides
    };
}

/**
 * Get test class data
 * @param {Object} overrides - Data overrides
 * @returns {Object} Test class data
 */
function getTestClass(overrides = {}) {
    return {
        ...TEST_DATA.SAMPLE_CLASSES[0],
        ...overrides
    };
}

/**
 * Get test section data
 * @param {Object} overrides - Data overrides
 * @returns {Object} Test section data
 */
function getTestSection(overrides = {}) {
    return {
        ...TEST_DATA.SAMPLE_SECTIONS[0],
        ...overrides
    };
}

/**
 * Generate unique test data
 * @param {string} prefix - Data prefix
 * @returns {Object} Unique test data
 */
function generateUniqueTestData(prefix = 'test') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    return {
        name: `${prefix}_${timestamp}_${random}`,
        email: `${prefix}_${timestamp}_${random}@test.com`,
        phone: `123456${random}`,
        roll: random
    };
}

module.exports = {
    TEST_DATA,
    getTestUser,
    getTestStudent,
    getTestClass,
    getTestSection,
    generateUniqueTestData
};
