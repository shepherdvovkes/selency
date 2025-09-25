/**
 * Interface for Student Service
 * Defines the contract for student business logic operations
 */
class IStudentService {
    /**
     * Get all students with optional filtering
     * @param {Object} payload - Filter criteria
     * @returns {Promise<Array>} Array of students
     */
    async getAllStudents(payload) {
        throw new Error('Method not implemented');
    }

    /**
     * Get student details by ID
     * @param {number} id - Student ID
     * @returns {Promise<Object>} Student details
     */
    async getStudentDetail(id) {
        throw new Error('Method not implemented');
    }

    /**
     * Add a new student
     * @param {Object} payload - Student data
     * @returns {Promise<Object>} Result object with message
     */
    async addNewStudent(payload) {
        throw new Error('Method not implemented');
    }

    /**
     * Update student information
     * @param {Object} payload - Updated student data
     * @returns {Promise<Object>} Result object with message
     */
    async updateStudent(payload) {
        throw new Error('Method not implemented');
    }

    /**
     * Set student status
     * @param {Object} params - Status update parameters
     * @param {number} params.userId - Student ID
     * @param {number} params.reviewerId - Reviewer ID
     * @param {boolean} params.status - New status
     * @returns {Promise<Object>} Result object with message
     */
    async setStudentStatus(params) {
        throw new Error('Method not implemented');
    }

    /**
     * Delete a student
     * @param {number} id - Student ID
     * @returns {Promise<Object>} Result object with message
     */
    async deleteStudent(id) {
        throw new Error('Method not implemented');
    }
}

module.exports = IStudentService;
