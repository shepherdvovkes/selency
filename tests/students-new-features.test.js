// Test only the newly implemented student CRUD features with mocked data
const { 
    getAllStudents, 
    addNewStudent, 
    getStudentDetail, 
    updateStudent, 
    setStudentStatus, 
    deleteStudent 
} = require('../src/modules/students/students-service');
const { getTestStudent, generateUniqueTestData } = require('./fixtures/test-data');

// Mock all external dependencies
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

describe('New Student CRUD Features - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('NEW FEATURE: Student Creation (POST)', () => {
        test('should create student with complete profile data', async () => {
            const mockStudentData = {
                name: 'John Doe',
                email: 'john.doe@test.com',
                gender: 'Male',
                phone: '1234567890',
                dob: '2005-01-01',
                currentAddress: '123 Test St',
                permanentAddress: '123 Test St',
                fatherName: 'Robert Doe',
                fatherPhone: '0987654321',
                motherName: 'Jane Doe',
                motherPhone: '1122334455',
                guardianName: 'Robert Doe',
                guardianPhone: '0987654321',
                relationOfGuardian: 'Father',
                systemAccess: true,
                class: 'Grade 10',
                section: 'A',
                admissionDate: '2023-09-01',
                roll: 1001
            };

            const mockResponse = {
                status: true,
                message: 'Student added successfully',
                userId: 123
            };

            addOrUpdateStudent.mockResolvedValue(mockResponse);

            const result = await addNewStudent(mockStudentData);

            expect(result.message).toContain('Student added');
            expect(addOrUpdateStudent).toHaveBeenCalledWith(mockStudentData);
            expect(addOrUpdateStudent).toHaveBeenCalledTimes(1);
        });

        test('should handle email verification sending', async () => {
            const mockStudentData = {
                name: 'Jane Smith',
                email: 'jane.smith@test.com',
                systemAccess: true
            };

            addOrUpdateStudent.mockResolvedValue({
                status: true,
                message: 'Student added successfully',
                userId: 124
            });

            const result = await addNewStudent(mockStudentData);

            expect(result.message).toContain('Student added');
        });

        test('should handle duplicate email error', async () => {
            const mockStudentData = {
                name: 'Duplicate Student',
                email: 'duplicate@test.com'
            };

            addOrUpdateStudent.mockResolvedValue({
                status: false,
                message: 'Email already exists'
            });

            await expect(addNewStudent(mockStudentData)).rejects.toThrow('Unable to add student');
        });
    });

    describe('NEW FEATURE: Student Listing with Filters (GET)', () => {
        test('should return all students without filters', async () => {
            const mockStudents = [
                { id: 1, name: 'Student 1', email: 'student1@test.com', systemAccess: true },
                { id: 2, name: 'Student 2', email: 'student2@test.com', systemAccess: true }
            ];

            findAllStudents.mockResolvedValue(mockStudents);

            const result = await getAllStudents({});

            expect(result).toEqual(mockStudents);
            expect(findAllStudents).toHaveBeenCalledWith({});
        });

        test('should filter students by name', async () => {
            const mockStudents = [
                { id: 1, name: 'John Doe', email: 'john@test.com', systemAccess: true }
            ];

            findAllStudents.mockResolvedValue(mockStudents);

            const result = await getAllStudents({ name: 'John Doe' });

            expect(result).toEqual(mockStudents);
            expect(findAllStudents).toHaveBeenCalledWith({ name: 'John Doe' });
        });

        test('should filter students by class', async () => {
            const mockStudents = [
                { id: 1, name: 'Student 1', email: 'student1@test.com', systemAccess: true }
            ];

            findAllStudents.mockResolvedValue(mockStudents);

            const result = await getAllStudents({ className: 'Grade 10' });

            expect(result).toEqual(mockStudents);
            expect(findAllStudents).toHaveBeenCalledWith({ className: 'Grade 10' });
        });

        test('should filter students by section', async () => {
            const mockStudents = [
                { id: 1, name: 'Student 1', email: 'student1@test.com', systemAccess: true }
            ];

            findAllStudents.mockResolvedValue(mockStudents);

            const result = await getAllStudents({ section: 'A' });

            expect(result).toEqual(mockStudents);
            expect(findAllStudents).toHaveBeenCalledWith({ section: 'A' });
        });

        test('should filter students by roll number', async () => {
            const mockStudents = [
                { id: 1, name: 'Student 1', email: 'student1@test.com', systemAccess: true }
            ];

            findAllStudents.mockResolvedValue(mockStudents);

            const result = await getAllStudents({ roll: 1001 });

            expect(result).toEqual(mockStudents);
            expect(findAllStudents).toHaveBeenCalledWith({ roll: 1001 });
        });

        test('should handle no students found', async () => {
            findAllStudents.mockResolvedValue([]);

            await expect(getAllStudents({})).rejects.toThrow('Students not found');
        });
    });

    describe('NEW FEATURE: Student Detail Retrieval (GET by ID)', () => {
        test('should get student details successfully', async () => {
            const mockStudentDetail = {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@test.com',
                systemAccess: true,
                phone: '1234567890',
                gender: 'Male',
                dob: '2005-01-01',
                class: 'Grade 10',
                section: 'A',
                roll: 1001,
                fatherName: 'Robert Doe',
                fatherPhone: '0987654321',
                motherName: 'Jane Doe',
                motherPhone: '1122334455',
                guardianName: 'Robert Doe',
                guardianPhone: '0987654321',
                relationOfGuardian: 'Father',
                currentAddress: '123 Test St',
                permanentAddress: '123 Test St',
                admissionDate: '2023-09-01',
                reporterName: 'Teacher Name'
            };

            findUserById.mockResolvedValue({ id: 1 });
            findStudentDetail.mockResolvedValue(mockStudentDetail);

            const result = await getStudentDetail(1);

            expect(result).toEqual(mockStudentDetail);
            expect(findUserById).toHaveBeenCalledWith(1);
            expect(findStudentDetail).toHaveBeenCalledWith(1);
        });

        test('should handle non-existent student', async () => {
            findUserById.mockResolvedValue(null);

            await expect(getStudentDetail(999)).rejects.toThrow('Student not found');
        });
    });

    describe('NEW FEATURE: Student Update (PUT)', () => {
        test('should update student information successfully', async () => {
            const mockUpdateData = {
                userId: 1,
                name: 'Updated John Doe',
                email: 'updated.john@test.com',
                gender: 'Male',
                phone: '1111111111',
                dob: '2005-01-01',
                currentAddress: '456 Updated St',
                permanentAddress: '456 Updated St',
                fatherName: 'Updated Father',
                fatherPhone: '2222222222',
                motherName: 'Updated Mother',
                motherPhone: '3333333333',
                guardianName: 'Updated Guardian',
                guardianPhone: '2222222222',
                relationOfGuardian: 'Father',
                systemAccess: true,
                class: 'Grade 11',
                section: 'B',
                admissionDate: '2023-09-01',
                roll: 2001
            };

            const mockResponse = {
                status: true,
                message: 'Student updated successfully'
            };

            addOrUpdateStudent.mockResolvedValue(mockResponse);

            const result = await updateStudent(mockUpdateData);

            expect(result.message).toBe('Student updated successfully');
            expect(addOrUpdateStudent).toHaveBeenCalledWith(mockUpdateData);
        });

        test('should handle update failure', async () => {
            const mockUpdateData = {
                userId: 999,
                name: 'Non-existent Student'
            };

            addOrUpdateStudent.mockResolvedValue({
                status: false,
                message: 'Student not found'
            });

            await expect(updateStudent(mockUpdateData)).rejects.toThrow('Student not found');
        });
    });

    describe('NEW FEATURE: Student Status Management (POST status)', () => {
        test('should disable student successfully', async () => {
            const mockStatusData = {
                userId: 1,
                reviewerId: 2,
                status: false
            };

            findUserById.mockResolvedValue({ id: 1 });
            findStudentToSetStatus.mockResolvedValue(1);

            const result = await setStudentStatus(mockStatusData);

            expect(result.message).toBe('Student status changed successfully');
            expect(findUserById).toHaveBeenCalledWith(1);
            expect(findStudentToSetStatus).toHaveBeenCalledWith(mockStatusData);
        });

        test('should enable student successfully', async () => {
            const mockStatusData = {
                userId: 1,
                reviewerId: 2,
                status: true
            };

            findUserById.mockResolvedValue({ id: 1 });
            findStudentToSetStatus.mockResolvedValue(1);

            const result = await setStudentStatus(mockStatusData);

            expect(result.message).toBe('Student status changed successfully');
            expect(findUserById).toHaveBeenCalledWith(1);
            expect(findStudentToSetStatus).toHaveBeenCalledWith(mockStatusData);
        });

        test('should handle non-existent student for status update', async () => {
            const mockStatusData = {
                userId: 999,
                reviewerId: 2,
                status: false
            };

            findUserById.mockResolvedValue(null);

            await expect(setStudentStatus(mockStatusData)).rejects.toThrow('Student not found');
        });

        test('should handle status update failure', async () => {
            const mockStatusData = {
                userId: 1,
                reviewerId: 2,
                status: false
            };

            findUserById.mockResolvedValue({ id: 1 });
            findStudentToSetStatus.mockResolvedValue(0);

            await expect(setStudentStatus(mockStatusData)).rejects.toThrow('Unable to disable student');
        });
    });

    describe('NEW FEATURE: Student Deletion (DELETE)', () => {
        test('should delete student successfully', async () => {
            findUserById.mockResolvedValue({ id: 1 });
            deleteStudentById.mockResolvedValue(1);

            const result = await deleteStudent(1);

            expect(result.message).toBe('Student deleted successfully');
            expect(findUserById).toHaveBeenCalledWith(1);
            expect(deleteStudentById).toHaveBeenCalledWith(1);
        });

        test('should handle non-existent student deletion', async () => {
            findUserById.mockResolvedValue(null);

            await expect(deleteStudent(999)).rejects.toThrow('Student not found');
        });

        test('should handle deletion failure', async () => {
            findUserById.mockResolvedValue({ id: 1 });
            deleteStudentById.mockResolvedValue(0);

            await expect(deleteStudent(1)).rejects.toThrow('Unable to delete student');
        });
    });

    describe('NEW FEATURE: Controller Function Exports', () => {
        test('should export all new controller functions', () => {
            const studentsController = require('../src/modules/students/students-controller');
            
            // Test all new controller functions exist
            expect(typeof studentsController.handleGetAllStudents).toBe('function');
            expect(typeof studentsController.handleAddStudent).toBe('function');
            expect(typeof studentsController.handleGetStudentDetail).toBe('function');
            expect(typeof studentsController.handleUpdateStudent).toBe('function');
            expect(typeof studentsController.handleStudentStatus).toBe('function');
            expect(typeof studentsController.handleDeleteStudent).toBe('function');
        });
    });

    describe('NEW FEATURE: Repository Function Exports', () => {
        test('should export all new repository functions', () => {
            const studentsRepository = require('../src/modules/students/students-repository');
            
            // Test all new repository functions exist
            expect(typeof studentsRepository.findAllStudents).toBe('function');
            expect(typeof studentsRepository.addOrUpdateStudent).toBe('function');
            expect(typeof studentsRepository.findStudentDetail).toBe('function');
            expect(typeof studentsRepository.findStudentToSetStatus).toBe('function');
            expect(typeof studentsRepository.deleteStudentById).toBe('function');
        });
    });

    describe('NEW FEATURE: Service Function Exports', () => {
        test('should export all new service functions', () => {
            const studentsService = require('../src/modules/students/students-service');
            
            // Test all new service functions exist
            expect(typeof studentsService.getAllStudents).toBe('function');
            expect(typeof studentsService.addNewStudent).toBe('function');
            expect(typeof studentsService.getStudentDetail).toBe('function');
            expect(typeof studentsService.updateStudent).toBe('function');
            expect(typeof studentsService.setStudentStatus).toBe('function');
            expect(typeof studentsService.deleteStudent).toBe('function');
        });
    });
});
