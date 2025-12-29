import db from "./db.js";

function getLastSunday() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export async function cleanupIfNeeded() {
  const lastSunday = getLastSunday();

  const result = await db.execute({
    sql: "SELECT value FROM meta WHERE key = ?",
    args: ["last_cleanup"]
  });

  const row = result.rows[0];
  if (row?.value === lastSunday) return;

  await db.execute({
    sql: "DELETE FROM bookings WHERE date < ?",
    args: [lastSunday]
  });

  await db.execute({
    sql: "DELETE FROM slots WHERE date < ?",
    args: [lastSunday]
  });

  await db.execute({
    sql: "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
    args: ["last_cleanup", lastSunday]
  });
}
