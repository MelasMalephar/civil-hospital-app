
Booked slots are disabled and clearly visible.

---

## 🔒 Anti-Spam Measures (MVP)

- One booking per **phone number per day**
- One booking per **device per day**
- Simple math captcha (frontend only)
- No login / OTP (kept intentionally simple)

---

## 🌐 Language Support

- Hindi (default)
- English

---

## 🧱 Tech Stack

**Frontend**
- React (Vite)
- Plain CSS (mobile-friendly, no animations)

**Backend**
- Vercel Serverless Functions (Node.js)

**Database**
- SQLite (auto-created at runtime)

**Hosting**
- Vercel (free tier)

---

## 🗂 Data Lifecycle

- App keeps **current week’s data only**
- Old data is automatically cleaned after Sunday
- No long-term storage or analytics (by design)

---

## 🚫 Non-Goals (Intentionally Not Included)

- Login / OTP
- Payments
- Notifications (SMS / WhatsApp)
- Admin dashboard
- Analytics or graphs
- Multi-doctor support

---

## 🚀 Deployment

The app is deployed on **Vercel**.

- No environment variables required
- SQLite database is created automatically
- Suitable for pilot / demo / low-traffic use

---

## ⚠️ Note on Persistence

Since this uses SQLite on serverless infrastructure:
- Data may reset on redeploy
- This is acceptable for MVP / pilot usage

For production scale, the database can be swapped with minimal changes.

---

## 👨‍⚕️ Intended Use

- Civil hospitals
- OPD clinics
- Doctors looking to reduce patient waiting time
- Mobile-first usage by patients

---

## 📌 Status

**MVP – Complete**

Further enhancements can be added based on real usage feedback.

---


## 🧑‍💻 Author

Hey, I’m **Namit Sharma** — a backend engineer who enjoys building small, practical tools that solve real-world problems.

This project was built with a simple goal: reduce waiting time and crowding in civil hospitals using minimal technology and clear logic. The focus was on reliability, ease of use, and respecting real operational constraints rather than adding unnecessary complexity.

If this project helped you or inspired a similar idea, you can support my side projects here:

☕ Buy me a coffee: https://buymeacoffee.com/devnamit
