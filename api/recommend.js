import db from "./db.js";
import { initSlots } from "./initSlots.js";
import { cleanupIfNeeded } from "./cleanupIfNeeded.js";

export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    await cleanupIfNeeded();

    const { date } = req.body;

    await initSlots(date);

    const result = await db.execute({
      sql: "SELECT * FROM slots WHERE date = ?",
      args: [date]
    });

    const slots = result.rows.map(s => {
      const score = s.booked / s.max_capacity;
      let crowd = "🟢 Low";
      if (score > 0.7) crowd = "🔴 High";
      else if (score > 0.4) crowd = "🟡 Medium";

      return { ...s, crowd };
    });

    res.json({
      recommended: slots[0],
      slots
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
