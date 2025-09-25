const IStudentRepository = require("../../interfaces/IStudentRepository");
const { ROLES } = require("../../constants/roles");

/**
 * Improved Student Repository with Dependency Injection
 * Implements IStudentRepository interface
 */
class StudentRepository extends IStudentRepository {
    constructor(databaseService, logger) {
        super();
        this.databaseService = databaseService;
        this.logger = logger;
    }

    /**
     * Get role ID by role name
     * @param {string} roleName - Role name
     * @returns {Promise<number>} Role ID
     */
    async getRoleId(roleName) {
        try {
            this.logger.debug(`Getting role ID for: ${roleName}`);
            
            const query = "SELECT id FROM roles WHERE name ILIKE $1";
            const queryParams = [roleName];
            const { rows } = await this.databaseService.query(query, queryParams);
            
            if (rows.length === 0) {
                throw new Error(`Role not found: ${roleName}`);
            }

            this.logger.debug(`Role ID found: ${rows[0].id} for role: ${roleName}`);
            return rows[0].id;
        } catch (error) {
            this.logger.error('Error getting role ID:', error);
            throw error;
        }
    }

    /**
     * Find all students with optional filtering
     * @param {Object} payload - Filter criteria
     * @returns {Promise<Array>} Array of students
     */
    async findAllStudents(payload) {
        try {
            const { name, className, section, roll } = payload;
            
            this.logger.debug('Finding students with filters:', payload);
            
            let query = `
                SELECT
                    t1.id,
                    t1.name,
                    t1.email,
                    t1.last_login AS "lastLogin",
                    t1.is_active AS "systemAccess"
                FROM users t1
                LEFT JOIN user_profiles t3 ON t1.id = t3.user_id
                WHERE t1.role_id = $${queryParams.length + 1}`;
            queryParams.push(ROLES.STUDENT);
            
            if (name) {
                query += ` AND t1.name = $${queryParams.length + 1}`;
                queryParams.push(name);
            }
            if (className) {
                query += ` AND t3.class_name = $${queryParams.length + 1}`;
                queryParams.push(className);
            }
            if (section) {
                query += ` AND t3.section_name = $${queryParams.length + 1}`;
                queryParams.push(section);
            }
            if (roll) {
                query += ` AND t3.roll = $${queryParams.length + 1}`;
                queryParams.push(roll);
            }

            query += ' ORDER BY t1.id';

            const { rows } = await this.databaseService.query(query, queryParams);
            
            this.logger.debug(`Found ${rows.length} students`);
            return rows;
        } catch (error) {
            this.logger.error('Error finding students:', error);
            throw error;
        }
    }

    /**
     * Add or update a student
     * @param {Object} payload - Student data
     * @returns {Promise<Object>} Result object with status and message
     */
    async addOrUpdateStudent(payload) {
        try {
            this.logger.debug('Adding or updating student:', { email: payload.email, name: payload.name });
            
            const query = "SELECT * FROM student_add_update($1)";
            const queryParams = [payload];
            const { rows } = await this.databaseService.query(query, queryParams);
            
            this.logger.debug('Student add/update result:', rows[0]);
            return rows[0];
        } catch (error) {
            this.logger.error('Error adding/updating student:', error);
            throw error;
        }
    }

    /**
     * Find student details by ID
     * @param {number} id - Student ID
     * @returns {Promise<Object>} Student details
     */
    async findStudentDetail(id) {
        try {
            this.logger.debug(`Finding student details for ID: ${id}`);
            
            const query = `
                SELECT
                    u.id,
                    u.name,
                    u.email,
                    u.is_active AS "systemAccess",
                    p.phone,
                    p.gender,
                    p.dob,
                    p.class_name AS "class",
                    p.section_name AS "section",
                    p.roll,
                    p.father_name AS "fatherName",
                    p.father_phone AS "fatherPhone",
                    p.mother_name AS "motherName",
                    p.mother_phone AS "motherPhone",
                    p.guardian_name AS "guardianName",
                    p.guardian_phone AS "guardianPhone",
                    p.relation_of_guardian as "relationOfGuardian",
                    p.current_address AS "currentAddress",
                    p.permanent_address AS "permanentAddress",
                    p.admission_dt AS "admissionDate",
                    r.name as "reporterName"
                FROM users u
                LEFT JOIN user_profiles p ON u.id = p.user_id
                LEFT JOIN users r ON u.reporter_id = r.id
                WHERE u.id = $1`;
            
            const queryParams = [id];
            const { rows } = await this.databaseService.query(query, queryParams);
            
            if (rows.length === 0) {
                this.logger.debug(`Student not found for ID: ${id}`);
                return null;
            }

            this.logger.debug(`Student details found for ID: ${id}`);
            return rows[0];
        } catch (error) {
            this.logger.error('Error finding student details:', error);
            throw error;
        }
    }

    /**
     * Update student status
     * @param {Object} params - Status update parameters
     * @param {number} params.userId - Student ID
     * @param {number} params.reviewerId - Reviewer ID
     * @param {boolean} params.status - New status
     * @returns {Promise<number>} Number of affected rows
     */
    async findStudentToSetStatus({ userId, reviewerId, status }) {
        try {
            this.logger.debug(`Setting student status for ID: ${userId}, Status: ${status}`);
            
            const now = new Date();
            const query = `
                UPDATE users
                SET
                    is_active = $1,
                    status_last_reviewed_dt = $2,
                    status_last_reviewer_id = $3
                WHERE id = $4
            `;
            const queryParams = [status, now, reviewerId, userId];
            const { rowCount } = await this.databaseService.query(query, queryParams);
            
            this.logger.debug(`Student status updated, affected rows: ${rowCount}`);
            return rowCount;
        } catch (error) {
            this.logger.error('Error setting student status:', error);
            throw error;
        }
    }

    /**
     * Delete student by ID
     * @param {number} id - Student ID
     * @returns {Promise<number>} Number of affected rows
     */
    async deleteStudentById(id) {
        try {
            this.logger.debug(`Deleting student ID: ${id}`);
            
            const query = `
                DELETE FROM users 
                WHERE id = $1 AND role_id = $2
            `;
            const queryParams = [id, ROLES.STUDENT];
            const { rowCount } = await this.databaseService.query(query, queryParams);
            
            this.logger.debug(`Student deleted, affected rows: ${rowCount}`);
            return rowCount;
        } catch (error) {
            this.logger.error('Error deleting student:', error);
            throw error;
        }
    }
}

module.exports = StudentRepository;
