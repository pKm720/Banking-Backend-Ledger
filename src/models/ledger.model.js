const { db } = require("../config/db");
const TABLE = "ledger_entries";
/**
 * Create a single ledger entry.
 * Always call this within a database transaction (pass trx).
 */
async function createEntry({ account_id, transaction_id, amount, type }, trx) {
    const query = trx ? trx(TABLE) : db(TABLE);
    const [entry] = await query
        .insert({ account_id, transaction_id, amount, type })
        .returning(["id", "account_id", "transaction_id", "amount", "type",
            "created_at"]);
    return entry;
}
/**
 * Create multiple ledger entries at once.
 * Always call this within a database transaction (pass trx).
 */
async function createEntries(entries, trx) {
    const query = trx ? trx(TABLE) : db(TABLE);
    return query.insert(entries).returning(["id", "account_id",
        "transaction_id", "amount", "type", "created_at"]);
}
module.exports = {
    createEntry,
    createEntries,
};