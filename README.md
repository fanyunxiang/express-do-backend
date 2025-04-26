# 📝 TODO-EXPRESS

An Express.js + MySQL based TODO application with user authentication and task management APIs.

---

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (via mysql2/promise)
- **Auth**: JWT-based authentication
- **Environment Management**: dotenv
- **Package Manager**: pnpm

---

## 📁 Project Structure

TODO-EXPRESS/
├── app.js # Main server file
├── .env # Environment variables
├── controllers/ # Logic for users and tasks
├── db/ # Database connection
├── middlewares/ # Authentication middleware
├── models/ # (Optional) DB model helpers
├── routes/ # API route definitions
├── utils/ # Utility functions (if any)
├── package.json
├── pnpm-lock.yaml
└── .gitignore #ignore

---

## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/your-username/todo-express.git
cd todo-express

---

### 2. Install Dependencies

pnpm install

### 3. Configure Environment Variables

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=todo_db
JWT_SECRET=your_jwt_secret

### 4. Run the App

pnpm start

Open your browser at http://localhost:3000

---
