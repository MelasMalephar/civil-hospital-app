import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPromise = open({
  filename: "hospital.db",
  driver: sqlite3.Database
});

// 🔹 Auto-create tables ONCE
async function init() {
  const db = await dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS slots (
      date TEXT,
      time TEXT,
      max_capacity INTEGER,
      booked INTEGER
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      time TEXT,
      phone TEXT,
      visit_type TEXT,
      device_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT
);

`);

  
}

// Run immediately
init();

export default dbPromise;
