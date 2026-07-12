const { db } = require("../config/db");
const bcrypt = require("bcryptjs");
const TABLE = "users";

/**
 * Create a new user. Hashes password before inserting.
 */
async function createUser({ email, name, password }) {
    const hash = await bcrypt.hash(password, 6);
    const [user] = await db(TABLE)
        .insert({ email: email.toLowerCase().trim(), name, password: hash })
        .returning(["id", "email", "name", "created_at", "updated_at"]);
    return user;
}

/**
 * Find user by email. Does NOT return password.
 */
async function findByEmail(email) {
    return db(TABLE)
        .where({ email: email.toLowerCase().trim() })
        .select("id", "email", "name", "created_at", "updated_at")
        .first();
}
/**
 * Find user by email AND include password hash (for login).
 */
async function findByEmailWithPassword(email) {
    return db(TABLE)
        .where({ email: email.toLowerCase().trim() })
        .select("id", "email", "name", "password")
        .first();
}
/**
 * Find user by ID. Does NOT return password or system_user.
 */
async function findById(id) {
    return db(TABLE)
        .where({ id })
        .select("id", "email", "name", "created_at", "updated_at")
        .first();
}
/**
 * Find user by ID AND include system_user flag (for system middleware).
 */
async function findByIdWithSystemUser(id) {
    return db(TABLE)
        .where({ id })
        .select("id", "email", "name", "is_system_user")
        .first();
}
/**
 * Compare a plain password against a stored bcrypt hash.
 */
async function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}
module.exports = {
    createUser,
    findByEmail,
    findByEmailWithPassword,
    findById,
    findByIdWithSystemUser,
    comparePassword,
};