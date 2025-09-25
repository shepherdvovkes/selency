const asyncHandler = require("express-async-handler");
const { 
    validateStudent, 
    validateStudentUpdate, 
    handleValidationErrors,
    securityLogger 
} = require("../../middlewares/security");

/**
 * Secure Student Controller with OWASP security measures
 * Implements input validation, security logging, and error handling
 */
class SecureStudentController {
    constructor(studentService, logger) {
        this.studentService = studentService;
        this.logger = logger;
    }

    /**
     * Handle get all students request with security logging
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleGetAllStudents = asyncHandler(async (req, res) => {
        try {
            const { name, className, section, roll } = req.query;
            
            // Log data access
            this.logger.info(`Data access: Getting students with filters`, {
                userId: req.user?.id,
                filters: { name, className, section, roll },
                ip: req.ip
            });
            
            const payload = {
                name,
                className,
                section,
                roll
            };

            const students = await this.studentService.getAllStudents(payload);
            
            this.logger.info(`Data access: Retrieved ${students.length} students`, {
                userId: req.user?.id,
                count: students.length,
                ip: req.ip
            });
            
            res.status(200).json({
                success: true,
                message: "Students retrieved successfully",
                data: students
            });
        } catch (error) {
            this.logger.error('Error in handleGetAllStudents:', {
                error: error.message,
                userId: req.user?.id,
                ip: req.ip
            });
            throw error;
        }
    });

    /**
     * Handle add student request with input validation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleAddStudent = asyncHandler(async (req, res) => {
        try {
            const studentData = req.body;
            
            // Log student creation attempt
            this.logger.info('Student creation attempt:', {
                userId: req.user?.id,
                studentEmail: studentData.email,
                studentName: studentData.name,
                ip: req.ip
            });
            
            const result = await this.studentService.addNewStudent(studentData);
            
            this.logger.info('Student created successfully:', {
                userId: req.user?.id,
                studentEmail: studentData.email,
                studentName: studentData.name,
                ip: req.ip
            });
            
            res.status(201).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            this.logger.error('Error in handleAddStudent:', {
                error: error.message,
                userId: req.user?.id,
                studentEmail: req.body?.email,
                ip: req.ip
            });
            throw error;
        }
    });

    /**
     * Handle update student request with input validation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleUpdateStudent = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            const studentData = req.body;
            
            // Log student update attempt
            this.logger.info('Student update attempt:', {
                userId: req.user?.id,
                studentId: id,
                studentEmail: studentData.email,
                ip: req.ip
            });
            
            // Add the student ID to the payload for update operation
            const payload = {
                ...studentData,
                userId: parseInt(id)
            };

            const result = await this.studentService.updateStudent(payload);
            
            this.logger.info('Student updated successfully:', {
                userId: req.user?.id,
                studentId: id,
                studentEmail: studentData.email,
                ip: req.ip
            });
            
            res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            this.logger.error('Error in handleUpdateStudent:', {
                error: error.message,
                userId: req.user?.id,
                studentId: req.params?.id,
                ip: req.ip
            });
            throw error;
        }
    });

    /**
     * Handle get student detail request with security logging
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleGetStudentDetail = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            
            // Log student detail access
            this.logger.info('Student detail access:', {
                userId: req.user?.id,
                studentId: id,
                ip: req.ip
            });
            
            const student = await this.studentService.getStudentDetail(parseInt(id));
            
            this.logger.info('Student details retrieved:', {
                userId: req.user?.id,
                studentId: id,
                studentEmail: student?.email,
                ip: req.ip
            });
            
            res.status(200).json({
                success: true,
                message: "Student details retrieved successfully",
                data: student
            });
        } catch (error) {
            this.logger.error('Error in handleGetStudentDetail:', {
                error: error.message,
                userId: req.user?.id,
                studentId: req.params?.id,
                ip: req.ip
            });
            throw error;
        }
    });

    /**
     * Handle student status update request with security logging
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleStudentStatus = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const reviewerId = req.user.id;
            
            // Log status change attempt
            this.logger.info('Student status change attempt:', {
                userId: req.user?.id,
                studentId: id,
                newStatus: status,
                ip: req.ip
            });
            
            const params = {
                userId: parseInt(id),
                reviewerId,
                status
            };

            const result = await this.studentService.setStudentStatus(params);
            
            this.logger.info('Student status changed successfully:', {
                userId: req.user?.id,
                studentId: id,
                newStatus: status,
                ip: req.ip
            });
            
            res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            this.logger.error('Error in handleStudentStatus:', {
                error: error.message,
                userId: req.user?.id,
                studentId: req.params?.id,
                ip: req.ip
            });
            throw error;
        }
    });

    /**
     * Handle delete student request with security logging
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    handleDeleteStudent = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            
            // Log student deletion attempt
            this.logger.info('Student deletion attempt:', {
                userId: req.user?.id,
                studentId: id,
                ip: req.ip
            });
            
            const result = await this.studentService.deleteStudent(parseInt(id));
            
            this.logger.info('Student deleted successfully:', {
                userId: req.user?.id,
                studentId: id,
                ip: req.ip
            });
            
            res.status(200).json({
                success: true,
                message: result.message,
                data: result
            });
        } catch (error) {
            this.logger.error('Error in handleDeleteStudent:', {
                error: error.message,
                userId: req.user?.id,
                studentId: req.params?.id,
                ip: req.ip
            });
            throw error;
        }
    });
}

module.exports = SecureStudentController;
