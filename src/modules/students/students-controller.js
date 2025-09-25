const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent, deleteStudent } = require("./students-service");

const handleGetAllStudents = asyncHandler(async (req, res) => {
    const { name, className, section, roll } = req.query;
    
    const payload = {
        name,
        className,
        section,
        roll
    };

    const students = await getAllStudents(payload);
    
    res.status(200).json({
        success: true,
        message: "Students retrieved successfully",
        data: students
    });
});

const handleAddStudent = asyncHandler(async (req, res) => {
    const studentData = req.body;
    
    const result = await addNewStudent(studentData);
    
    res.status(201).json({
        success: true,
        message: result.message,
        data: result
    });
});

const handleUpdateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const studentData = req.body;
    
    // Add the student ID to the payload for update operation
    const payload = {
        ...studentData,
        userId: parseInt(id)
    };
    
    const result = await updateStudent(payload);
    
    res.status(200).json({
        success: true,
        message: result.message,
        data: result
    });
});

const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const student = await getStudentDetail(parseInt(id));
    
    res.status(200).json({
        success: true,
        message: "Student details retrieved successfully",
        data: student
    });
});

const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const reviewerId = req.user.id; // Assuming user info is available in req.user
    
    const result = await setStudentStatus({
        userId: parseInt(id),
        reviewerId,
        status
    });
    
    res.status(200).json({
        success: true,
        message: result.message,
        data: result
    });
});

const handleDeleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const result = await deleteStudent(parseInt(id));
    
    res.status(200).json({
        success: true,
        message: result.message,
        data: result
    });
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
    handleDeleteStudent,
};
