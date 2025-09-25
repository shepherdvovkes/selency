/**
 * Dependency Injection Container
 * Manages dependencies and provides dependency injection functionality
 */
class DIContainer {
    constructor() {
        this.services = new Map();
        this.singletons = new Map();
        this.factories = new Map();
    }

    /**
     * Register a service
     * @param {string} name - Service name
     * @param {Function|Object} implementation - Service implementation
     * @param {Object} options - Registration options
     */
    register(name, implementation, options = {}) {
        const serviceConfig = {
            implementation,
            singleton: options.singleton || false,
            dependencies: options.dependencies || [],
            factory: options.factory || false
        };

        this.services.set(name, serviceConfig);
    }

    /**
     * Register a singleton service
     * @param {string} name - Service name
     * @param {Function|Object} implementation - Service implementation
     * @param {Array} dependencies - Service dependencies
     */
    registerSingleton(name, implementation, dependencies = []) {
        this.register(name, implementation, {
            singleton: true,
            dependencies
        });
    }

    /**
     * Register a factory
     * @param {string} name - Factory name
     * @param {Function} factory - Factory function
     * @param {Array} dependencies - Factory dependencies
     */
    registerFactory(name, factory, dependencies = []) {
        this.factories.set(name, {
            factory,
            dependencies
        });
    }

    /**
     * Resolve a service
     * @param {string} name - Service name
     * @returns {*} Resolved service instance
     */
    resolve(name) {
        // Check if already resolved as singleton
        if (this.singletons.has(name)) {
            return this.singletons.get(name);
        }

        const serviceConfig = this.services.get(name);
        if (!serviceConfig) {
            throw new Error(`Service '${name}' not registered`);
        }

        let instance;

        if (serviceConfig.singleton) {
            // Create singleton instance
            instance = this.createInstance(serviceConfig);
            this.singletons.set(name, instance);
        } else {
            // Create new instance
            instance = this.createInstance(serviceConfig);
        }

        return instance;
    }

    /**
     * Create service instance
     * @param {Object} serviceConfig - Service configuration
     * @returns {*} Service instance
     */
    createInstance(serviceConfig) {
        const { implementation, dependencies } = serviceConfig;

        if (typeof implementation === 'function') {
            // Resolve dependencies
            const resolvedDependencies = dependencies.map(dep => this.resolve(dep));
            
            // Create instance with dependencies
            if (implementation.prototype && implementation.prototype.constructor) {
                // Class constructor
                return new implementation(...resolvedDependencies);
            } else {
                // Function
                return implementation(...resolvedDependencies);
            }
        } else {
            // Object instance
            return implementation;
        }
    }

    /**
     * Resolve factory
     * @param {string} name - Factory name
     * @returns {*} Factory result
     */
    resolveFactory(name) {
        const factoryConfig = this.factories.get(name);
        if (!factoryConfig) {
            throw new Error(`Factory '${name}' not registered`);
        }

        const { factory, dependencies } = factoryConfig;
        const resolvedDependencies = dependencies.map(dep => this.resolve(dep));
        
        return factory(...resolvedDependencies);
    }

    /**
     * Check if service is registered
     * @param {string} name - Service name
     * @returns {boolean} Service registration status
     */
    has(name) {
        return this.services.has(name) || this.factories.has(name);
    }

    /**
     * Get all registered services
     * @returns {Array} List of service names
     */
    getRegisteredServices() {
        return Array.from(this.services.keys());
    }

    /**
     * Clear all services
     */
    clear() {
        this.services.clear();
        this.singletons.clear();
        this.factories.clear();
    }
}

// Create singleton container instance
const container = new DIContainer();

module.exports = container;
