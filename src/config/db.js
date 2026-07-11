const knex = require("knex");
const db = knex({
    client: "pg",
    connection: {
        connectionString: process.env.DB_URL,
        ssl: { rejectUnauthorized: false } // required for Neon
    },
    pool: {
        min: 2,
        max: 10
    }
});
async function connectToDB() {
    try {
        // Test the connection with a lightweight query
        await db.raw("SELECT 1");
        console.log("Server connected to the DB (PostgreSQL/Neon)");
    } catch (err) {
        console.error("Cannot connect to DB:", err.message);
        process.exit(1);
    }
}
module.exports = { db, connectToDB };