const { ApiError } = require("../../utils");
const IStudentService = require("../../interfaces/IStudentService");
const IStudentRepository = require("../../interfaces/IStudentRepository");
const IEmailService = require("../../interfaces/IEmailService");

/**
 * Improved Student Service with Dependency Injection
 * Implements IStudentService interface
 */
class StudentService extends IStudentService {
    constructor(studentRepository, emailService, logger) {
        super();
        this.studentRepository = studentRepository;
        this.emailService = emailService;
        this.logger = logger;
    }

    /**
     * Check if student exists
     * @param {number} id - Student ID
     * @throws {ApiError} If student not found
     */
    async checkStudentId(id) {
        try {
            const student = await this.studentRepository.findStudentDetail(id);
            if (!student) {
                throw new ApiError(404, "Student not found");
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            this.logger.error('Error checking student ID:', error);
            throw new ApiError(500, "Error validating student");
        }
    }

    /**
     * Get all students with filtering
     * @param {Object} payload - Filter criteria
     * @returns {Promise<Array>} Array of students
     */
    async getAllStudents(payload) {
        try {
            this.logger.info('Getting all students with filters:', payload);
            
            const students = await this.studentRepository.findAllStudents(payload);
            
            if (students.length <= 0) {
                throw new ApiError(404, "Students not found");
            }

            this.logger.info(`Found ${students.length} students`);
            return students;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            this.logger.error('Error getting students:', error);
            throw new ApiError(500, "Error retrieving students");
        }
    }

    /**
     * Get student details by ID
     * @param {number} id - Student ID
     * @returns {Promise<Object>} Student details
     */
    async getStudentDetail(id) {
        try {
            this.logger.info(`Getting student details for ID: ${id}`);
            
            await this.checkStudentId(id);
            const student = await this.studentRepository.findStudentDetail(id);
            
            if (!student) {
                throw new ApiError(404, "Student not found");
            }

            this.logger.info(`Student details retrieved for ID: ${id}`);
            return student;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            this.logger.error('Error getting student details:', error);
            throw new ApiError(500, "Error retrieving student details");
        }
    }

    /**
     * Add a new student
     * @param {Object} payload - Student data
     * @returns {Promise<Object>} Result object with message
     */
    async addNewStudent(payload) {
        const ADD_STUDENT_AND_EMAIL_SEND_SUCCESS = "Student added and verification email sent successfully.";
        const ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL = "Student added, but failed to send verification email.";
        
        try {
            this.logger.info('Adding new student:', { email: payload.email, name: payload.name });
            
            const result = await this.studentRepository.addOrUpdateStudent(payload);
            
            if (!result.status) {
                throw new ApiError(500, result.message);
            }

            // Try to send verification email
            try {
                await this.emailService.sendAccountVerificationEmail({ 
                    userId: result.userId, 
                    userEmail: payload.email 
                });
                
                this.logger.info(`Verification email sent to: ${payload.email}`);
                return { message: ADD_STUDENT_AND_EMAIL_SEND_SUCCESS };
            } catch (emailError) {
                this.logger.warn(`Failed to send verification email to: ${payload.email}`, emailError);
                return { message: ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL };
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            this.logger.error('Error adding student:', error);
            throw new ApiError(500, "Unable to add student");
        }
    }

    /**
     * Update student information
     * @param {Object} payload - Updated student data
     * @returns {Promise<Object>} Result object with message
     */
    async updateStudent(payload) {
        try {
            this.logger.info(`Updating student ID: ${payload.userId}`);
            
            const result = await this.studentRepository.addOrUpdateStudent(payload);
            
            if (!result.status) {
                throw new ApiError(500, result.message);
            }

            this.logger.info(`Student updated successfully: ${payload.userId}`);
            return { message: result.message };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            this.logger.error('Error updating student:', error);
            throw new ApiError(500, "Error updating student");
        }
    }

    /**
     * Set student status
     * @param {Object} params - Status update parameters
     * @param {number} params.userId - Student ID
     * @param {number} params.reviewerId - Reviewer ID
     * @param {boolean} params.status - New status
     * @returns {Promise<Object>} Result object with message
     */
    async setStudentStatus({ userId, reviewerId, status }) {
        try {
            this.logger.info(`Setting student status for ID: ${userId}, Status: ${status}`);
            
            await this.checkStudentId(userId);

            const affectedRow = await this.studentRepository.findStudentToSetStatus({ 
                userId, 
                reviewerId, 
                status 
            });
            
            if (affectedRow <= 0) {
                throw new ApiError(500, "Unable to update student status");
            }

            this.logger.info(`Student status updated successfully: ${userId}`);
            return { message: "Student status changed successfully" };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            this.logger.error('Error setting student status:', error);
            throw new ApiError(500, "Error updating student status");
        }
    }

    /**
     * Delete a student
     * @param {number} id - Student ID
     * @returns {Promise<Object>} Result object with message
     */
    async deleteStudent(id) {
        try {
            this.logger.info(`Deleting student ID: ${id}`);
            
            await this.checkStudentId(id);

            const affectedRow = await this.studentRepository.deleteStudentById(id);
            
            if (affectedRow <= 0) {
                throw new ApiError(500, "Unable to delete student");
            }

            this.logger.info(`Student deleted successfully: ${id}`);
            return { message: "Student deleted successfully" };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            this.logger.error('Error deleting student:', error);
            throw new ApiError(500, "Error deleting student");
        }
    }
}

module.exports = StudentService;
