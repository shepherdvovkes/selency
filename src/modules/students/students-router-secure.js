const express = require("express");
const { 
    createRateLimit, 
    securityHeaders, 
    requestSizeLimit, 
    securityLogger,
    validateStudent,
    validateStudentUpdate,
    handleValidationErrors
} = require("../../middlewares/security");
const { authenticateToken } = require("../../middlewares/authenticate-token");
const { isUserAdmin } = require("../../middlewares/is-user-admin");
const SecureStudentController = require("./students-controller-secure");
const { container } = require("../../container/registerServices");

const router = express.Router();

// Apply security headers to all routes
router.use(securityHeaders);

// Apply request size limit
router.use(requestSizeLimit('10mb'));

// Apply security logging
router.use(securityLogger);

// Apply rate limiting
router.use(createRateLimit(15 * 60 * 1000, 100)); // 15 minutes, 100 requests

// Apply authentication and authorization
router.use(authenticateToken);
router.use(isUserAdmin);

// Create secure controller instance
const studentController = new SecureStudentController(
    container.resolve('studentService'),
    container.resolve('loggerService')
);

// Student routes with security measures
router.get("/", studentController.handleGetAllStudents);

router.post("/", 
    validateStudent,
    handleValidationErrors,
    studentController.handleAddStudent
);

router.get("/:id", studentController.handleGetStudentDetail);

router.put("/:id", 
    validateStudentUpdate,
    handleValidationErrors,
    studentController.handleUpdateStudent
);

router.post("/:id/status", 
    studentController.handleStudentStatus
);

router.delete("/:id", studentController.handleDeleteStudent);

module.exports = router;
