require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { db } = require("./db");
async function runMigration() {
    console.log("Running schema migration...");

    const sqlPath = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    try {
        await db.raw(sql);
        console.log("✅ Schema migration completed successfully.");
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    } finally {
        await db.destroy();
    }
}
runMigration();
