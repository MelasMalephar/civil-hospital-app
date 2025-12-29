import db from "./db.js";
import { cleanupIfNeeded } from "./cleanupIfNeeded.js";

export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    await cleanupIfNeeded();

    const { date, time, phone, visitType, deviceId } = req.body;

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // phone check
    const phoneCheck = await db.execute({
      sql: "SELECT 1 FROM bookings WHERE date = ? AND phone = ?",
      args: [date, phone]
    });

    if (phoneCheck.rows.length > 0) {
      return res.json({ message: "Already booked for today" });
    }

    // device check
    const deviceCheck = await db.execute({
      sql: "SELECT 1 FROM bookings WHERE date = ? AND device_id = ?",
      args: [date, deviceId]
    });

    if (deviceCheck.rows.length > 0) {
      return res.json({ message: "Only one booking allowed per device per day" });
    }

    // slot check
    const slotResult = await db.execute({
      sql: "SELECT * FROM slots WHERE date = ? AND time = ?",
      args: [date, time]
    });

    const slot = slotResult.rows[0];
    if (!slot) {
      return res.status(400).json({ message: "Invalid slot" });
    }

    if (slot.booked >= slot.max_capacity) {
      return res.json({ message: "Slot full" });
    }

    // update slot
    await db.execute({
      sql: "UPDATE slots SET booked = booked + 1 WHERE date = ? AND time = ?",
      args: [date, time]
    });

    // insert booking
    await db.execute({
      sql: `
        INSERT INTO bookings (date, time, phone, visit_type, device_id)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [date, time, phone, visitType, deviceId]
    });

    res.json({ message: "Booking confirmed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
