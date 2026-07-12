const { db } = require("../config/db");
const TABLE = "token_blacklist";
/**
 * Add a token to the blacklist.
 */
async function blacklistToken(token) {
    const [entry] = await db(TABLE)
        .insert({ token })
        .returning(["id", "token", "created_at"]);
    return entry;
}
/**
 * Check if a token is blacklisted AND was created within the last 5 hours.
 * Tokens older than 5 hours are naturally expired and no longer considered
blacklisted.
 */
async function isTokenBlacklisted(token) {
    const entry = await db(TABLE)
        .where({ token })
        .where("created_at", ">", db.raw("NOW() - INTERVAL '5 hours'"))
        .first();
    return !!entry;
}
module.exports = {
    blacklistToken,
    isTokenBlacklisted,
};
