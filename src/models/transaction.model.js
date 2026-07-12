const { db } = require("../config/db");
const TABLE = "transactions";
/**
 * Create a new transaction record.
 * Pass trx to run this inside a database transaction.
 */
async function createTransaction({ from_account_id, to_account_id, amount,
    idempotency_key, status = "PENDING" }, trx) {
    const query = trx ? trx(TABLE) : db(TABLE);
    const [transaction] = await query
        .insert({
            from_account_id, to_account_id, amount, idempotency_key,
            status
        })
        .returning(["id", "from_account_id", "to_account_id", "amount",
            "status", "idempotency_key", "created_at", "updated_at"]);
    return transaction;
}
/**
 * Find a transaction by its idempotency key (for duplicate detection).
 */
async function findByIdempotencyKey(idempotency_key) {
    return db(TABLE).where({ idempotency_key }).first();
}
/**
 * Update a transaction's status.
 * Pass trx to run this inside a database transaction.
 */
async function updateStatus(id, status, trx) {
    const query = trx ? trx(TABLE) : db(TABLE);
    const [updated] = await query
        .where({ id })
        .update({ status, updated_at: db.raw("NOW()") })
        .returning(["id", "status", "updated_at"]);
    return updated;
}
/**
 * Find a transaction by its ID.
 */
async function findById(id) {
    return db(TABLE).where({ id }).first();
}
module.exports = {
    createTransaction,
    findByIdempotencyKey,
    updateStatus,
    findById,
};
