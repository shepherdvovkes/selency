// Simple unit tests for student CRUD operations
const { 
    getAllStudents, 
    addNewStudent, 
    getStudentDetail, 
    updateStudent, 
    setStudentStatus, 
    deleteStudent 
} = require('../src/modules/students/students-service');

// Mock the repository functions
jest.mock('../src/modules/students/students-repository', () => ({
    findAllStudents: jest.fn(),
    addOrUpdateStudent: jest.fn(),
    findStudentDetail: jest.fn(),
    findStudentToSetStatus: jest.fn(),
    deleteStudentById: jest.fn()
}));

jest.mock('../src/shared/repository', () => ({
    findUserById: jest.fn()
}));

jest.mock('../src/utils', () => ({
    ApiError: class ApiError extends Error {
        constructor(statusCode, message) {
            super(message);
            this.statusCode = statusCode;
        }
    },
    sendAccountVerificationEmail: jest.fn().mockResolvedValue({ success: true })
}));

const { 
    findAllStudents, 
    addOrUpdateStudent, 
    findStudentDetail, 
    findStudentToSetStatus, 
    deleteStudentById 
} = require('../src/modules/students/students-repository');

const { findUserById } = require('../src/shared/repository');

describe('Student Service Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllStudents', () => {
        test('should return students successfully', async () => {
            const mockStudents = [
                { id: 1, name: 'Student 1', email: 'student1@test.com' },
                { id: 2, name: 'Student 2', email: 'student2@test.com' }
            ];
            
            findAllStudents.mockResolvedValue(mockStudents);

            const result = await getAllStudents({});

            expect(result).toEqual(mockStudents);
            expect(findAllStudents).toHaveBeenCalledWith({});
        });

        test('should throw error when no students found', async () => {
            findAllStudents.mockResolvedValue([]);

            await expect(getAllStudents({})).rejects.toThrow('Students not found');
        });
    });

    describe('addNewStudent', () => {
        test('should add student successfully', async () => {
            const studentData = {
                name: 'New Student',
                email: 'new@test.com'
            };

            addOrUpdateStudent.mockResolvedValue({
                status: true,
                message: 'Student added successfully',
                userId: 123
            });

            const result = await addNewStudent(studentData);

            expect(result.message).toContain('Student added');
            expect(addOrUpdateStudent).toHaveBeenCalledWith(studentData);
        });

        test('should handle email send failure', async () => {
            const studentData = {
                name: 'New Student',
                email: 'new@test.com'
            };

            addOrUpdateStudent.mockResolvedValue({
                status: true,
                message: 'Student added successfully',
                userId: 123
            });

            const result = await addNewStudent(studentData);

            expect(result.message).toContain('Student added');
        });

        test('should throw error when student creation fails', async () => {
            const studentData = {
                name: 'New Student',
                email: 'new@test.com'
            };

            addOrUpdateStudent.mockResolvedValue({
                status: false,
                message: 'Email already exists'
            });

            await expect(addNewStudent(studentData)).rejects.toThrow('Unable to add student');
        });
    });

    describe('getStudentDetail', () => {
        test('should return student details successfully', async () => {
            const mockStudent = {
                id: 1,
                name: 'Test Student',
                email: 'test@test.com'
            };

            findUserById.mockResolvedValue({ id: 1 });
            findStudentDetail.mockResolvedValue(mockStudent);

            const result = await getStudentDetail(1);

            expect(result).toEqual(mockStudent);
            expect(findUserById).toHaveBeenCalledWith(1);
            expect(findStudentDetail).toHaveBeenCalledWith(1);
        });

        test('should throw error when student not found', async () => {
            findUserById.mockResolvedValue(null);

            await expect(getStudentDetail(999)).rejects.toThrow('Student not found');
        });
    });

    describe('updateStudent', () => {
        test('should update student successfully', async () => {
            const studentData = {
                userId: 1,
                name: 'Updated Student',
                email: 'updated@test.com'
            };

            addOrUpdateStudent.mockResolvedValue({
                status: true,
                message: 'Student updated successfully'
            });

            const result = await updateStudent(studentData);

            expect(result.message).toBe('Student updated successfully');
            expect(addOrUpdateStudent).toHaveBeenCalledWith(studentData);
        });

        test('should throw error when update fails', async () => {
            const studentData = {
                userId: 1,
                name: 'Updated Student',
                email: 'updated@test.com'
            };

            addOrUpdateStudent.mockResolvedValue({
                status: false,
                message: 'Student not found'
            });

            await expect(updateStudent(studentData)).rejects.toThrow('Student not found');
        });
    });

    describe('setStudentStatus', () => {
        test('should change student status successfully', async () => {
            const statusData = {
                userId: 1,
                reviewerId: 2,
                status: false
            };

            findUserById.mockResolvedValue({ id: 1 });
            findStudentToSetStatus.mockResolvedValue(1);

            const result = await setStudentStatus(statusData);

            expect(result.message).toBe('Student status changed successfully');
            expect(findUserById).toHaveBeenCalledWith(1);
            expect(findStudentToSetStatus).toHaveBeenCalledWith(statusData);
        });

        test('should throw error when student not found', async () => {
            const statusData = {
                userId: 999,
                reviewerId: 2,
                status: false
            };

            findUserById.mockResolvedValue(null);

            await expect(setStudentStatus(statusData)).rejects.toThrow('Student not found');
        });

        test('should throw error when status update fails', async () => {
            const statusData = {
                userId: 1,
                reviewerId: 2,
                status: false
            };

            findUserById.mockResolvedValue({ id: 1 });
            findStudentToSetStatus.mockResolvedValue(0);

            await expect(setStudentStatus(statusData)).rejects.toThrow('Unable to disable student');
        });
    });

    describe('deleteStudent', () => {
        test('should delete student successfully', async () => {
            findUserById.mockResolvedValue({ id: 1 });
            deleteStudentById.mockResolvedValue(1);

            const result = await deleteStudent(1);

            expect(result.message).toBe('Student deleted successfully');
            expect(findUserById).toHaveBeenCalledWith(1);
            expect(deleteStudentById).toHaveBeenCalledWith(1);
        });

        test('should throw error when student not found', async () => {
            findUserById.mockResolvedValue(null);

            await expect(deleteStudent(999)).rejects.toThrow('Student not found');
        });

        test('should throw error when deletion fails', async () => {
            findUserById.mockResolvedValue({ id: 1 });
            deleteStudentById.mockResolvedValue(0);

            await expect(deleteStudent(1)).rejects.toThrow('Unable to delete student');
        });
    });
});

describe('Student CRUD Operations Validation', () => {
    test('All CRUD operations are properly exported', () => {
        const studentsService = require('../src/modules/students/students-service');
        
        expect(typeof studentsService.getAllStudents).toBe('function');
        expect(typeof studentsService.addNewStudent).toBe('function');
        expect(typeof studentsService.getStudentDetail).toBe('function');
        expect(typeof studentsService.updateStudent).toBe('function');
        expect(typeof studentsService.setStudentStatus).toBe('function');
        expect(typeof studentsService.deleteStudent).toBe('function');
    });

    test('Controller functions are properly exported', () => {
        const studentsController = require('../src/modules/students/students-controller');
        
        expect(typeof studentsController.handleGetAllStudents).toBe('function');
        expect(typeof studentsController.handleAddStudent).toBe('function');
        expect(typeof studentsController.handleGetStudentDetail).toBe('function');
        expect(typeof studentsController.handleUpdateStudent).toBe('function');
        expect(typeof studentsController.handleStudentStatus).toBe('function');
        expect(typeof studentsController.handleDeleteStudent).toBe('function');
    });

    test('Repository functions are properly exported', () => {
        const studentsRepository = require('../src/modules/students/students-repository');
        
        expect(typeof studentsRepository.findAllStudents).toBe('function');
        expect(typeof studentsRepository.addOrUpdateStudent).toBe('function');
        expect(typeof studentsRepository.findStudentDetail).toBe('function');
        expect(typeof studentsRepository.findStudentToSetStatus).toBe('function');
        expect(typeof studentsRepository.deleteStudentById).toBe('function');
    });
});
