/**
 * Interface for Student Repository
 * Defines the contract for student data access operations
 */
class IStudentRepository {
    /**
     * Find all students with optional filtering
     * @param {Object} payload - Filter criteria
     * @param {string} [payload.name] - Student name filter
     * @param {string} [payload.className] - Class name filter
     * @param {string} [payload.section] - Section filter
     * @param {number} [payload.roll] - Roll number filter
     * @returns {Promise<Array>} Array of students
     */
    async findAllStudents(payload) {
        throw new Error('Method not implemented');
    }

    /**
     * Add or update a student
     * @param {Object} payload - Student data
     * @returns {Promise<Object>} Result object with status and message
     */
    async addOrUpdateStudent(payload) {
        throw new Error('Method not implemented');
    }

    /**
     * Find student details by ID
     * @param {number} id - Student ID
     * @returns {Promise<Object>} Student details
     */
    async findStudentDetail(id) {
        throw new Error('Method not implemented');
    }

    /**
     * Update student status
     * @param {Object} params - Status update parameters
     * @param {number} params.userId - Student ID
     * @param {number} params.reviewerId - Reviewer ID
     * @param {boolean} params.status - New status
     * @returns {Promise<number>} Number of affected rows
     */
    async findStudentToSetStatus(params) {
        throw new Error('Method not implemented');
    }

    /**
     * Delete student by ID
     * @param {number} id - Student ID
     * @returns {Promise<number>} Number of affected rows
     */
    async deleteStudentById(id) {
        throw new Error('Method not implemented');
    }

    /**
     * Get role ID by role name
     * @param {string} roleName - Role name
     * @returns {Promise<number>} Role ID
     */
    async getRoleId(roleName) {
        throw new Error('Method not implemented');
    }
}

module.exports = IStudentRepository;
