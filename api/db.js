import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

/* ---------- auto init tables ---------- */
async function init() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS slots (
      date TEXT,
      time TEXT,
      max_capacity INTEGER,
      booked INTEGER
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      time TEXT,
      phone TEXT,
      visit_type TEXT,
      device_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
}

/* run once per cold start */
init().catch(console.error);

export default db;
