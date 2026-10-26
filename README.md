# Automated Student OD and Leave Approval with Attendance Integration

A centralized web-based system to automate student On-Duty (OD) and Leave requests, digital multi-level
approvals, and automatic attendance updates — replacing manual WhatsApp messages, paper forms, and
manual attendance corrections.

## Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios, Recharts
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Auth:** JWT + bcrypt

## Features

- Role-based access control for 5 roles: Student, Faculty, HOD, Attendance Coordinator, Administrator
- Student OD and Leave request forms with file upload for supporting documents
- Two-step digital approval workflow: Faculty → HOD
- **Automatic attendance update**: once a request is fully approved by the HOD, the system automatically
  marks the student's attendance as `OD` or `Leave` for every date in the approved range, with duplicate
  prevention and a full audit trail
- In-app notification system (submission, approval, rejection, forwarding, attendance updates)
- Role-specific dashboards with stats and charts
- Admin panel for managing students, faculty/HOD/coordinators, departments, and attendance
- Coordinator tools to verify and manually correct attendance
- Fully responsive UI (desktop, tablet, mobile)

## Project Structure

```
student-od-leave-system/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/      # Route handler logic
│   ├── middleware/       # Auth, RBAC, error handling, file upload
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── seed/               # Demo data seeder
│   ├── utils/               # JWT, notifications, attendance helper
│   ├── uploads/               # Uploaded supporting documents (created at runtime)
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── context/         # AuthContext
    │   ├── hooks/             # useAuth
    │   ├── layouts/             # DashboardLayout (sidebar + topbar)
    │   ├── pages/                 # All route pages, organized by role
    │   ├── services/                # Axios API service modules
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## Prerequisites

- Node.js v18+ and npm
- MongoDB running locally, or a free MongoDB Atlas cluster

---

## Step-by-Step Setup Instructions

### 1. Install dependencies

```bash
# From the project root
cd student-od-leave-system

# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd ../frontend
npm install
```

### 2. Configure MongoDB

**Option A — Local MongoDB**
Install and start MongoDB locally (default URI `mongodb://127.0.0.1:27017`).

```bash
# macOS (Homebrew)
brew tap mongodb/brew && brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Option B — MongoDB Atlas (cloud, free tier)**
Create a free cluster at https://www.mongodb.com/cloud/atlas, whitelist your IP, create a database user,
and copy the connection string (looks like `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/od_leave_system`).

### 3. Create the `.env` files

**Backend** — copy the example and fill in your values:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/od_leave_system
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> Generate a strong secret with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

**Frontend** — copy the example:

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env` (only needed if your backend isn't on `localhost:5000`):

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the backend

```bash
cd backend
npm run dev      # starts on http://localhost:5000 with nodemon (auto-restart)
# or
npm start        # production start
```

You should see:
```
MongoDB connected: 127.0.0.1
Server running in development mode on port 5000
```

### 5. Run the frontend

In a separate terminal:

```bash
cd frontend
npm run dev       # starts on http://localhost:5173
```

Open http://localhost:5173 in your browser.

### 6. Seed demo data

With the backend `.env` configured and MongoDB running:

```bash
cd backend
npm run seed
```

This wipes existing data in the configured database and creates demo accounts for every role, plus
sample OD/Leave requests, attendance records, and notifications.

### 7. Log into the system

Use any of the demo accounts below (password is the same for all):

| Role                     | Email                     | Password     |
|--------------------------|----------------------------|--------------|
| Student                  | student@example.com        | Password123  |
| Student (2)              | student2@example.com       | Password123  |
| Student (3)              | student3@example.com       | Password123  |
| Faculty                  | faculty@example.com        | Password123  |
| Faculty (2)              | faculty2@example.com       | Password123  |
| HOD                      | hod@example.com            | Password123  |
| Attendance Coordinator   | coordinator@example.com    | Password123  |
| Administrator            | admin@example.com          | Password123  |

You can also click a role button under "Demo Accounts" on the login page to auto-fill the credentials.

---

## Approval Workflow

```
Student submits OD/Leave request  →  status: Pending
        ↓
Faculty reviews and Approves/Rejects  →  status: Faculty Approved / Faculty Rejected
        ↓ (if approved)
HOD reviews and Approves/Rejects  →  status: HOD Approved / HOD Rejected
        ↓ (if approved)
System marks request Fully Approved
        ↓
Attendance automatically updated to OD/Leave for the date range  →  status: Attendance Updated
        ↓
Audit log entry created; student notified
```

Faculty and HOD can add remarks/comments at each step, visible to the student in "My Requests".

## API Overview

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Method | Endpoint                     | Access                    |
|--------|-------------------------------|----------------------------|
| POST   | /auth/register                | Public                     |
| POST   | /auth/login                   | Public                     |
| GET    | /auth/profile                 | Authenticated              |
| PUT    | /auth/profile                 | Authenticated              |
| POST   | /od                            | Student                    |
| GET    | /od                             | Authenticated (role-scoped) |
| GET    | /od/:id                         | Authenticated               |
| PUT    | /od/:id/approve                  | Faculty, HOD                |
| PUT    | /od/:id/reject                    | Faculty, HOD                |
| POST   | /leave                             | Student                     |
| GET    | /leave                              | Authenticated (role-scoped) |
| GET    | /leave/:id                           | Authenticated                |
| PUT    | /leave/:id/approve                    | Faculty, HOD                  |
| PUT    | /leave/:id/reject                      | Faculty, HOD                   |
| GET    | /attendance                             | Authenticated (role-scoped)     |
| POST   | /attendance                              | Faculty, Coordinator, Admin       |
| PUT    | /attendance/:id                           | Faculty, Coordinator, Admin         |
| GET    | /attendance/audit-log                      | Coordinator, HOD, Admin               |
| GET    | /notifications                              | Authenticated                          |
| PUT    | /notifications/:id/read                      | Authenticated                           |
| PUT    | /notifications/read-all                       | Authenticated                            |
| GET    | /users/faculty                                 | Authenticated                             |
| GET/POST/PUT/DELETE | /admin/users                     | Admin                                      |
| GET    | /admin/departments                              | Admin                                       |
| GET    | /admin/analytics                                 | Admin                                        |

## Security Notes

- Passwords are hashed with bcrypt before being stored; the hash is never returned in API responses.
- All protected routes require a valid JWT; role-based middleware restricts access per endpoint.
- Secrets (JWT secret, DB URI) are read from environment variables — never hardcoded.
- File uploads are restricted by type (images, PDF, Word docs) and size (5MB max).

## Notes for Production Use

This is a functional MVP intended for local demonstration/evaluation. Before deploying to production,
consider: rate limiting, HTTPS, moving uploaded files to cloud storage (S3, etc.), input sanitization
hardening, refresh tokens, and email notifications in addition to in-app ones.
