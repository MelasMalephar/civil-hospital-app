import dbPromise from "./db.js";

export async function initSlots(date) {
  const db = await dbPromise;

  const existing = await db.get(
    "SELECT COUNT(*) as c FROM slots WHERE date=?",
    date
  );

  if (existing.c > 0) return;

  const slots = [
    "09:30-10:00","10:00-10:30","10:30-11:00",
    "11:00-11:30","11:30-12:00","12:00-12:30",
    "12:30-13:00","13:00-13:30",
    "14:00-14:30","14:30-15:00","15:00-15:30",
    "15:30-16:00","16:00-16:30","16:30-17:00",
    "17:00-17:30"
  ];

  for (const time of slots) {
    await db.run(
      "INSERT INTO slots (date, time, max_capacity, booked) VALUES (?, ?, ?, ?)",
      date,
      time,
      10,
      0
    );
  }
}
