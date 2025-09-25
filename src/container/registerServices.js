const container = require('./DIContainer');
const config = require('../config/application');

// Services
const LoggerService = require('../services/LoggerService');
const DatabaseService = require('../services/DatabaseService');
const EmailService = require('../services/EmailService');

// Repositories
const StudentRepository = require('../modules/students/students-repository-improved');

// Services
const StudentService = require('../modules/students/students-service-improved');

// Controllers
const StudentController = require('../modules/students/students-controller-improved');

/**
 * Register all services in the DI container
 */
function registerServices() {
    // Register configuration
    container.registerSingleton('config', config);

    // Register logger
    container.registerSingleton('logger', LoggerService, ['config']);

    // Register database service
    container.registerSingleton('databaseService', DatabaseService, ['config', 'logger']);

    // Register email service
    container.registerSingleton('emailService', EmailService, ['config', 'logger']);

    // Register repositories
    container.registerSingleton('studentRepository', StudentRepository, ['databaseService', 'logger']);

    // Register services
    container.registerSingleton('studentService', StudentService, ['studentRepository', 'emailService', 'logger']);

    // Register controllers
    container.registerSingleton('studentController', StudentController, ['studentService', 'logger']);

    console.log('✅ All services registered in DI container');
}

/**
 * Get service from container
 * @param {string} serviceName - Service name
 * @returns {*} Service instance
 */
function getService(serviceName) {
    return container.resolve(serviceName);
}

/**
 * Get all registered services
 * @returns {Array} List of service names
 */
function getRegisteredServices() {
    return container.getRegisteredServices();
}

module.exports = {
    registerServices,
    getService,
    getRegisteredServices
};
