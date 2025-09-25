/**
 * Interface for Email Service
 * Defines the contract for email operations
 */
class IEmailService {
    /**
     * Send account verification email
     * @param {Object} params - Email parameters
     * @param {number} params.userId - User ID
     * @param {string} params.userEmail - User email
     * @returns {Promise<Object>} Result object
     */
    async sendAccountVerificationEmail(params) {
        throw new Error('Method not implemented');
    }

    /**
     * Send password setup email
     * @param {Object} params - Email parameters
     * @param {number} params.userId - User ID
     * @param {string} params.userEmail - User email
     * @returns {Promise<Object>} Result object
     */
    async sendPasswordSetupEmail(params) {
        throw new Error('Method not implemented');
    }

    /**
     * Send generic email
     * @param {Object} params - Email parameters
     * @param {string} params.to - Recipient email
     * @param {string} params.subject - Email subject
     * @param {string} params.content - Email content
     * @returns {Promise<Object>} Result object
     */
    async sendEmail(params) {
        throw new Error('Method not implemented');
    }
}

module.exports = IEmailService;
