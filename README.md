
# 🏁 Online Programming Contest Platform

A full-stack web platform for hosting and managing competitive programming contests. Designed for educators, organizations, or individuals who want to create and conduct time-bound coding contests with custom problems, real-time evaluation, and secure submission.

---

## 🌟 Features

- 👨‍💻 **Contest Management** (Create, edit, delete contests)
- 🧩 **Problem Bank** (Add custom problems with test cases)
- 🧪 **Secure Code Evaluation** using Docker sandbox or Judge0
- ⏱️ **Real-Time Submissions** with verdicts (AC, WA, TLE, RE)
- 📈 **Live Leaderboard** and scoring system
- 🔐 **Authentication System** for admin and participants
- 🎯 **Responsive UI** for desktop and mobile

---

## 🛠 Tech Stack

| Layer          | Technology                     |
|----------------|--------------------------------|
| Frontend       | React.js / Bootstrap 5         |
| Backend        | Node.js / Express.js           |
| Code Judge     | Judge0 API or Docker Sandbox   |
| Database       | MongoDB / PostgreSQL           |
| Authentication | JWT / bcrypt                   |
| Deployment     | Render / Vercel / Railway      |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SUNIL4479/Project.git
cd Project 
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Fill in DB, PORT, JWT_SECRET etc.
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 4. Optional: Code Judge Setup (Local)

- If not using Judge0, configure Docker-based execution sandbox.
- Ensure security using tools like `nsjail`, `gVisor`, or `Firejail`.

---

## 📁 Folder Structure

```
Project/
│
├── client/                 # React frontend
│   ├── src/components/     # Reusable UI components
│   └── src/pages/          # Page-level views
│
├── server/                 # Express backend
│   ├── models/             # Mongoose/Postgres models
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── judge/              # Code evaluation logic
│   └── utils/              # Utility functions
│
├── README.md
└── .env.example
```

---

## 🔒 Security Measures

- All user code is executed in a secure, sandboxed environment.
- Input/output test cases are stored securely and never exposed.
- Rate-limiting and JWT auth prevent brute-force attacks.

---

## 🧪 To-Do / Roadmap

- [ ] Add test case generation from problem statement
- [ ] Add support for ICPC-style contest freeze
- [ ] Add team-based contests
- [ ] Add editorial/problem discussion page
- [ ] Improve mobile UX
- [ ] Dockerize entire stack

---

## 🗂 Changelog / Development Log

| Date       | Feature/Update                                      | Developer |
|------------|------------------------------------------------------|-----------|
| 2025-07-15 | 🎉 Initialized project repo                          | Team   |
| 2025-07-16 | 🧱 Created backend API routes for contest & problem  | Team   |
| 2025-07-17 | 🖼️ Setup frontend with React + Bootstrap             | Team   |
| 2025-07-18 | 🔐 Added user login/signup with JWT                  | Team   |
| 2025-07-19 | ⚙️ Integrated Judge0 API for secure code execution  | Team   |
| 2025-07-20 | 📈 Implemented real-time leaderboard and scoring     | Team   |
| 2025-07-21 | 📦 Added Docker support for isolated code runner     | Team   |
| 2025-07-22 | 🧪 Deployed full stack on Railway + Vercel           | Team   |

---

## 🧠 Credits & Inspiration

- Codeforces (contest format inspiration)
- GeeksforGeeks (problem-style inspiration)
- Judge0 (open-source code execution engine)
- LeetCode (UI/UX reference)

---
