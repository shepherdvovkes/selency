const express = require("express");
const { getService } = require("../../container/registerServices");

const router = express.Router();

// Get student controller from DI container
const studentController = getService('studentController');

// Student routes with improved controller
router.get("/", studentController.handleGetAllStudents);
router.post("/", studentController.handleAddStudent);
router.get("/:id", studentController.handleGetStudentDetail);
router.put("/:id", studentController.handleUpdateStudent);
router.post("/:id/status", studentController.handleStudentStatus);
router.delete("/:id", studentController.handleDeleteStudent);

module.exports = router;
