// Mock email service for testing
const mockSendEmail = jest.fn().mockResolvedValue({ success: true });

module.exports = {
    sendAccountVerificationEmail: mockSendEmail,
    sendPasswordSetupEmail: mockSendEmail,
    sendEmail: mockSendEmail
};
