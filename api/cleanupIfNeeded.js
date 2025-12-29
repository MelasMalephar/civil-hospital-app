import dbPromise from "./db.js";

function getLastSunday() {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay()); // Sunday
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export async function cleanupIfNeeded() {
  const db = await dbPromise;
  const lastSunday = getLastSunday();

  const row = await db.get(
    "SELECT value FROM meta WHERE key='last_cleanup'"
  );

  if (row?.value === lastSunday) return; // already cleaned

  // 🔥 CLEANUP
  await db.run(
    "DELETE FROM bookings WHERE date < ?",
    lastSunday
  );
  await db.run(
    "DELETE FROM slots WHERE date < ?",
    lastSunday
  );

  // save cleanup date
  await db.run(
    "INSERT OR REPLACE INTO meta (key, value) VALUES ('last_cleanup', ?)",
    lastSunday
  );
}
