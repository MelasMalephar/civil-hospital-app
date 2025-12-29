import dbPromise from "./db.js";
import { initSlots } from "./initSlots.js";
import { cleanupIfNeeded } from "./cleanupIfNeeded.js";

await cleanupIfNeeded();

export default async function handler(req, res) {
  try {
    const { date } = req.body;
    const db = await dbPromise;

    await initSlots(date);

    const slots = await db.all(
      "SELECT * FROM slots WHERE date=?",
      date
    );

    const scored = slots.map(s => {
      const score = s.booked / s.max_capacity;
      let crowd = "🟢 Low";
      if (score > 0.7) crowd = "🔴 High";
      else if (score > 0.4) crowd = "🟡 Medium";
      return { ...s, score, crowd };
    });

    // scored.sort((a, b) => a.score - b.score);

    res.json({ recommended: scored[0], slots: scored });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server error" });
  }
}
