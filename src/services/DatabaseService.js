const { Pool } = require('pg');
const { processDBRequest } = require('../utils');

/**
 * Database Service
 * Provides database operations with connection pooling
 */
class DatabaseService {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.pool = null;
        this.initializePool();
    }

    /**
     * Initialize database connection pool
     */
    initializePool() {
        try {
            const dbConfig = this.config.getDatabaseConfig();
            
            this.pool = new Pool({
                connectionString: dbConfig.url,
                host: dbConfig.host,
                port: dbConfig.port,
                database: dbConfig.name,
                user: dbConfig.user,
                password: dbConfig.password,
                ssl: dbConfig.ssl,
                min: dbConfig.pool.min,
                max: dbConfig.pool.max,
                idleTimeoutMillis: dbConfig.pool.idle
            });

            this.logger.info('Database connection pool initialized');
        } catch (error) {
            this.logger.error('Error initializing database pool:', error);
            throw error;
        }
    }

    /**
     * Execute database query
     * @param {string} query - SQL query
     * @param {Array} params - Query parameters
     * @returns {Promise<Object>} Query result
     */
    async query(query, params = []) {
        try {
            this.logger.debug('Executing database query:', { query: query.substring(0, 100) + '...', params });
            
            const result = await processDBRequest({ query, queryParams: params });
            
            this.logger.debug('Database query executed successfully');
            return result;
        } catch (error) {
            this.logger.error('Error executing database query:', error);
            throw error;
        }
    }

    /**
     * Execute database query with connection
     * @param {string} query - SQL query
     * @param {Array} params - Query parameters
     * @returns {Promise<Object>} Query result
     */
    async queryWithConnection(query, params = []) {
        let client;
        try {
            this.logger.debug('Executing database query with connection:', { query: query.substring(0, 100) + '...', params });
            
            client = await this.pool.connect();
            const result = await client.query(query, params);
            
            this.logger.debug('Database query with connection executed successfully');
            return result;
        } catch (error) {
            this.logger.error('Error executing database query with connection:', error);
            throw error;
        } finally {
            if (client) {
                client.release();
            }
        }
    }

    /**
     * Begin database transaction
     * @returns {Promise<Object>} Transaction client
     */
    async beginTransaction() {
        try {
            const client = await this.pool.connect();
            await client.query('BEGIN');
            
            this.logger.debug('Database transaction started');
            return client;
        } catch (error) {
            this.logger.error('Error beginning transaction:', error);
            throw error;
        }
    }

    /**
     * Commit database transaction
     * @param {Object} client - Transaction client
     */
    async commitTransaction(client) {
        try {
            await client.query('COMMIT');
            client.release();
            
            this.logger.debug('Database transaction committed');
        } catch (error) {
            this.logger.error('Error committing transaction:', error);
            throw error;
        }
    }

    /**
     * Rollback database transaction
     * @param {Object} client - Transaction client
     */
    async rollbackTransaction(client) {
        try {
            await client.query('ROLLBACK');
            client.release();
            
            this.logger.debug('Database transaction rolled back');
        } catch (error) {
            this.logger.error('Error rolling back transaction:', error);
            throw error;
        }
    }

    /**
     * Get database connection pool status
     * @returns {Object} Pool status
     */
    getPoolStatus() {
        return {
            totalCount: this.pool.totalCount,
            idleCount: this.pool.idleCount,
            waitingCount: this.pool.waitingCount
        };
    }

    /**
     * Close database connection pool
     */
    async close() {
        try {
            await this.pool.end();
            this.logger.info('Database connection pool closed');
        } catch (error) {
            this.logger.error('Error closing database pool:', error);
            throw error;
        }
    }
}

module.exports = DatabaseService;
