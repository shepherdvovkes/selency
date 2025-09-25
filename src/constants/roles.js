/**
 * Role Constants
 * Centralized role definitions to avoid hardcoded role IDs
 */
const ROLES = {
    ADMIN: 1,
    STAFF: 2,
    STUDENT: 3
};

/**
 * Role names mapping
 */
const ROLE_NAMES = {
    [ROLES.ADMIN]: 'admin',
    [ROLES.STAFF]: 'staff',
    [ROLES.STUDENT]: 'student'
};

/**
 * Get role ID by name
 * @param {string} roleName - Role name
 * @returns {number} Role ID
 */
function getRoleId(roleName) {
    const roleMap = {
        'admin': ROLES.ADMIN,
        'staff': ROLES.STAFF,
        'student': ROLES.STUDENT
    };
    
    return roleMap[roleName.toLowerCase()];
}

/**
 * Get role name by ID
 * @param {number} roleId - Role ID
 * @returns {string} Role name
 */
function getRoleName(roleId) {
    return ROLE_NAMES[roleId];
}

/**
 * Check if role ID is valid
 * @param {number} roleId - Role ID
 * @returns {boolean} Is valid role
 */
function isValidRole(roleId) {
    return Object.values(ROLES).includes(roleId);
}

/**
 * Get all role IDs
 * @returns {Array<number>} Array of role IDs
 */
function getAllRoleIds() {
    return Object.values(ROLES);
}

/**
 * Get all role names
 * @returns {Array<string>} Array of role names
 */
function getAllRoleNames() {
    return Object.keys(ROLE_NAMES);
}

module.exports = {
    ROLES,
    ROLE_NAMES,
    getRoleId,
    getRoleName,
    isValidRole,
    getAllRoleIds,
    getAllRoleNames
};
