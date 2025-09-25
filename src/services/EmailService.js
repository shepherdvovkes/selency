const IEmailService = require("../interfaces/IEmailService");
const { sendAccountVerificationEmail, sendPasswordSetupEmail, sendEmail } = require("../utils");

/**
 * Email Service Implementation
 * Implements IEmailService interface
 */
class EmailService extends IEmailService {
    constructor(config, logger) {
        super();
        this.config = config;
        this.logger = logger;
    }

    /**
     * Send account verification email
     * @param {Object} params - Email parameters
     * @param {number} params.userId - User ID
     * @param {string} params.userEmail - User email
     * @returns {Promise<Object>} Result object
     */
    async sendAccountVerificationEmail(params) {
        try {
            this.logger.info(`Sending account verification email to: ${params.userEmail}`);
            
            const result = await sendAccountVerificationEmail({
                userId: params.userId,
                userEmail: params.userEmail
            });
            
            this.logger.info(`Account verification email sent successfully to: ${params.userEmail}`);
            return result;
        } catch (error) {
            this.logger.error('Error sending account verification email:', error);
            throw error;
        }
    }

    /**
     * Send password setup email
     * @param {Object} params - Email parameters
     * @param {number} params.userId - User ID
     * @param {string} params.userEmail - User email
     * @returns {Promise<Object>} Result object
     */
    async sendPasswordSetupEmail(params) {
        try {
            this.logger.info(`Sending password setup email to: ${params.userEmail}`);
            
            const result = await sendPasswordSetupEmail({
                userId: params.userId,
                userEmail: params.userEmail
            });
            
            this.logger.info(`Password setup email sent successfully to: ${params.userEmail}`);
            return result;
        } catch (error) {
            this.logger.error('Error sending password setup email:', error);
            throw error;
        }
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
        try {
            this.logger.info(`Sending email to: ${params.to}, Subject: ${params.subject}`);
            
            const result = await sendEmail({
                to: params.to,
                subject: params.subject,
                content: params.content
            });
            
            this.logger.info(`Email sent successfully to: ${params.to}`);
            return result;
        } catch (error) {
            this.logger.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = EmailService;
