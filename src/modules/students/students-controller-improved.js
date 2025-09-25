const asyncHandler = require("express-async-handler");

/**
 * Improved Student Controller with Dependency Injection
 * Handles HTTP requests and responses for student operations
 */
class StudentController {
    constructor(studentService, logger) {
        this.studentService = studentService;
        this.logger = logger;
    }

    /**
     * Handle get all students request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleGetAllStudents = asyncHandler(async (req, res) => {
        try {
            const { name, className, section, roll } = req.query;
            
            const payload = {
                name,
                className,
                section,
                roll
            };

            this.logger.info('Getting all students with filters:', payload);
            const students = await this.studentService.getAllStudents(payload);
            
            this.logger.info(`Retrieved ${students.length} students`);
            res.status(200).json({
                success: true,
                message: "Students retrieved successfully",
                data: students
            });
        } catch (error) {
            this.logger.error('Error in handleGetAllStudents:', error);
            throw error;
        }
    });

    /**
     * Handle add student request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleAddStudent = asyncHandler(async (req, res) => {
        try {
            const studentData = req.body;
            
            this.logger.info('Adding new student:', { email: studentData.email, name: studentData.name });
            const result = await this.studentService.addNewStudent(studentData);
            
            this.logger.info('Student added successfully');
            res.status(201).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            this.logger.error('Error in handleAddStudent:', error);
            throw error;
        }
    });

    /**
     * Handle update student request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleUpdateStudent = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            const studentData = req.body;
            
            // Add the student ID to the payload for update operation
            const payload = {
                ...studentData,
                userId: parseInt(id)
            };

            this.logger.info(`Updating student ID: ${id}`);
            const result = await this.studentService.updateStudent(payload);
            
            this.logger.info(`Student updated successfully: ${id}`);
            res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            this.logger.error('Error in handleUpdateStudent:', error);
            throw error;
        }
    });

    /**
     * Handle get student detail request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleGetStudentDetail = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            
            this.logger.info(`Getting student details for ID: ${id}`);
            const student = await this.studentService.getStudentDetail(parseInt(id));
            
            this.logger.info(`Student details retrieved for ID: ${id}`);
            res.status(200).json({
                success: true,
                message: "Student details retrieved successfully",
                data: student
            });
        } catch (error) {
            this.logger.error('Error in handleGetStudentDetail:', error);
            throw error;
        }
    });

    /**
     * Handle student status update request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleStudentStatus = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const reviewerId = req.user.id; // Assuming user info is available in req.user
            
            const params = {
                userId: parseInt(id),
                reviewerId,
                status
            };

            this.logger.info(`Setting student status for ID: ${id}, Status: ${status}`);
            const result = await this.studentService.setStudentStatus(params);
            
            this.logger.info(`Student status updated successfully: ${id}`);
            res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            this.logger.error('Error in handleStudentStatus:', error);
            throw error;
        }
    });

    /**
     * Handle delete student request
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleDeleteStudent = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            
            this.logger.info(`Deleting student ID: ${id}`);
            const result = await this.studentService.deleteStudent(parseInt(id));
            
            this.logger.info(`Student deleted successfully: ${id}`);
            res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            this.logger.error('Error in handleDeleteStudent:', error);
            throw error;
        }
    });
}

module.exports = StudentController;
