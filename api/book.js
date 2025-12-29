import dbPromise from "./db.js";

export default async function handler(req, res) {
  try {
    const { date, time, phone, visitType, deviceId } = req.body;
    const db = await dbPromise;

    if (!phone || phone.length < 8) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // 🔒 1 booking per phone per day
    const phoneExists = await db.get(
      "SELECT 1 FROM bookings WHERE date=? AND phone=?",
      date,
      phone
    );

    if (phoneExists) {
      return res.json({ message: "Already booked for today" });
    }

    // 🔒 1 booking per device per day
    const deviceExists = await db.get(
      "SELECT 1 FROM bookings WHERE date=? AND device_id=?",
      date,
      deviceId
    );

    if (deviceExists) {
      return res.json({ message: "Only one booking allowed per device per day" });
    }

    // Check slot capacity
    const slot = await db.get(
      "SELECT * FROM slots WHERE date=? AND time=?",
      date,
      time
    );

    if (!slot) {
      return res.status(400).json({ message: "Invalid slot" });
    }

    if (slot.booked >= slot.max_capacity) {
      return res.json({ message: "Slot full" });
    }

    // Update slot count
    await db.run(
      "UPDATE slots SET booked = booked + 1 WHERE date=? AND time=?",
      date,
      time
    );

    // Insert booking
    await db.run(
      `INSERT INTO bookings (date, time, phone, visit_type, device_id)
       VALUES (?, ?, ?, ?, ?)`,
      date,
      time,
      phone,
      visitType,
      deviceId
    );

    res.json({ message: "Booking confirmed" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
