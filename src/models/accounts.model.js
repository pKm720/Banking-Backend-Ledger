const { db } = require("../config/db");
const TABLE = "accounts";
/**
 * Create a new account for a user.
 */
async function createAccount({ user_id, currency = "INR" }, trx) {
    const query = trx ? trx(TABLE) : db(TABLE);
    const [account] = await query
        .insert({ user_id, currency, status: "ACTIVE" })
        .returning(["id", "user_id", "status", "currency", "created_at",
            "updated_at"]);
    return account;
}
/**
 * Find a single account by its ID.
 */
async function findById(id, trx) {
    const query = trx ? trx(TABLE) : db(TABLE);
    return query.where({ id }).first();
}
/**
 * Find all accounts belonging to a user.
 */
async function findByUserId(user_id) {
    return db(TABLE).where({ user_id });
}
/**
 * Find multiple accounts by an array of IDs (used in transaction creation).
 */
async function findByIds(ids, trx) {
    const query = trx ? trx(TABLE) : db(TABLE);
    return query.whereIn("id", ids);
}
/**
 * Get the current balance of an account.
 * FROM ledger_entries WHERE account_id = ?
 */
async function getBalance(accountId, trx) {
    const query = trx ? trx("ledger_entries") : db("ledger_entries");
    const result = await query
        .where({ account_id: accountId })
        .select(
            db.raw(`
                COALESCE(
                    SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE 0 END) -
                    SUM(CASE WHEN type = 'DEBIT' THEN amount ELSE 0 END),
                    0
                ) AS balance
            `)
        )
        .first();
    return parseFloat(result.balance);
}
module.exports = {
    createAccount,
    findById,
    findByUserId,
    findByIds,
    getBalance,
};