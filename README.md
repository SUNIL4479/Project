
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
cd server
npm install
cp .env.example .env   # Fill in DB, PORT, JWT_SECRET etc.
npm start
```

### 3. Frontend Setup

```bash
cd client
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
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
