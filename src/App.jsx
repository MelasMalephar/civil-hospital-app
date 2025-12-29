import { useState } from "react";

/* ---------- helpers ---------- */

function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

function generateCaptcha() {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 1;
  return { question: `${a} + ${b} = ?`, answer: String(a + b) };
}

/* ---------- text ---------- */

const TEXT = {
  hi: {
    title: "डॉक्टर अपॉइंटमेंट",
    recommend: "सबसे अच्छा समय बताएं",
    phone: "मोबाइल नंबर",
    book: "बुक करें",
    new: "नया",
    follow: "फॉलो-अप",
    today: "आज",
    tomorrow: "कल",
    best: "सुझाया गया समय"
  },
  en: {
    title: "Doctor Appointment",
    recommend: "Recommend Best Time",
    phone: "Phone Number",
    book: "Book",
    new: "New",
    follow: "Follow-up",
    today: "Today",
    tomorrow: "Tomorrow",
    best: "Recommended Slot"
  }
};

/* ---------- app ---------- */

export default function App() {
  const [lang, setLang] = useState("hi");
  const [day, setDay] = useState("today");
  const [visitType, setVisitType] = useState("new");

  const [slots, setSlots] = useState([]);
  const [recommended, setRecommended] = useState(null);

  const [phone, setPhone] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaObj, setCaptchaObj] = useState(generateCaptcha());

  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);


  const t = TEXT[lang];
  const deviceId = getDeviceId();

  /* ---------- recommend ---------- */

  async function recommend() {
    try {
      setLoading(true);

      const date =
        day === "today"
          ? new Date().toISOString().slice(0, 10)
          : new Date(Date.now() + 86400000).toISOString().slice(0, 10);

      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date })
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      setRecommended(data.recommended);
      setSlots(data.slots);
    } catch (e) {
      alert("Failed to load slots");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- book ---------- */

 async function book(time) {
  try {
    setBookingLoading(true);

    const date =
      day === "today"
        ? new Date().toISOString().slice(0, 10)
        : new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    const res = await fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        time,
        phone,
        visitType,
        deviceId
      })
    });

    const data = await res.json();

    // ✅ ALWAYS show backend message
    alert(data.message);

    // ✅ CLOSE MODAL FOR ANY VALID RESPONSE
    setSelectedSlot(null);

    // ✅ RESET INPUTS
    setPhone("");
    setCaptcha("");
    setCaptchaObj(generateCaptcha());

    // 🔁 Refresh slots
    recommend();

  } catch (err) {
    console.error(err);
    alert("Unable to book right now. Please try again.");
  } finally {
    setBookingLoading(false);
  }
}


  /* ---------- UI ---------- */

  return (
    <div className="container">
      <div className="lang">
        <button onClick={() => setLang("hi")}>हिंदी</button>
        <button onClick={() => setLang("en")}>English</button>
      </div>
      <div className="center-block">
  <h2>{t.title}</h2>

  <div className="row center-row">
    <select onChange={(e) => setDay(e.target.value)}>
      <option value="today">{t.today}</option>
      <option value="tomorrow">{t.tomorrow}</option>
    </select>

    <select onChange={(e) => setVisitType(e.target.value)}>
      <option value="new">{t.new}</option>
      <option value="follow">{t.follow}</option>
    </select>
  </div>

  <button onClick={recommend} disabled={loading}>
    {loading ? "Loading..." : t.recommend}
  </button>
</div>


      {recommended && (
        <div className="recommended">
          <strong>{t.best}:</strong> {recommended.time} —{" "}
          {recommended.crowd}
        </div>
      )}

      <div className="slot-list">
        {slots.map((s) => (
          <div key={s.time} className="slot">
            <span>
              {s.time} — {s.crowd} ({s.booked}/{s.max_capacity})
            </span>
            <button onClick={() => setSelectedSlot(s.time)}>
              {t.book}
            </button>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirm Appointment</h3>

            <p>
              Slot: <strong>{selectedSlot}</strong>
            </p>

            <div className="modal-body">
              <label className="label">Mobile Number</label>
              <input
                className="input"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label className="label">Verification</label>
              <div className="captcha-row">
                <span className="captcha-q">{captchaObj.question}</span>
                <input
                  className="captcha-input"
                  placeholder="Answer"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                />
              </div>

              <button
                className="confirm-btn"
                disabled={bookingLoading}
                onClick={() => book(selectedSlot)}
              >
                {bookingLoading ? "Booking..." : "Confirm Appointment"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => setSelectedSlot(null)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
