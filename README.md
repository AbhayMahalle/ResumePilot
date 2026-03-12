<div align="center">
  <br />
  <img src="public/readme/hero.webp" alt="ResumePilot Banner" />
  <br />

  <div>
    <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  </div>

  <h1 align="center">ResumePilot</h1>
  <p align="center">
    AI-powered resume analyzer that scores your resume against job descriptions and provides actionable feedback to land your dream job.
  </p>
</div>

---

## 📋 Table of Contents

- [✨ Introduction](#-introduction)
- [⚙️ Tech Stack](#️-tech-stack)
- [🔋 Features](#-features)
- [📂 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 API Endpoints](#-api-endpoints)
- [📄 Environment Variables](#-environment-variables)
- [📸 Screenshots](#-screenshots)

## ✨ Introduction

**ResumePilot** is a full-stack AI-powered resume analysis platform. Upload your resume, provide a job description, and get an instant ATS compatibility score along with detailed, category-wise feedback — covering content, structure, skills, tone, and more.

The frontend uses **React Router v7** with **Puter.js** for seamless browser-based auth, storage, and AI analysis. The backend provides a standalone **Express.js REST API** with **JWT authentication** and **MongoDB Atlas** for secure user management.

## ⚙️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI library with reusable components |
| [React Router v7](https://reactrouter.com/) | File-based routing, loaders, SSR |
| [TypeScript](https://www.typescriptlang.org/) | Static typing and better DX |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Zustand](https://github.com/pmndrs/zustand) | Minimal global state management |
| [Vite](https://vite.dev/) | Lightning-fast dev server & bundler |
| [Puter.js](https://puter.com/) | Browser-based auth, cloud storage & AI |
| [pdfjs-dist](https://mozilla.github.io/pdf.js/) | Client-side PDF rendering |

### Backend

| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | JavaScript runtime |
| [Express.js](https://expressjs.com/) | Web framework for REST APIs |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud-hosted NoSQL database |
| [Mongoose](https://mongoosejs.com/) | MongoDB ODM with schema validation |
| [JWT](https://jwt.io/) | Stateless token-based authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Secure password hashing |
| [Google Gemini AI](https://ai.google.dev/) | `gemini-2.5-flash` model for resume parsing and ATS evaluation |
| [Multer](https://github.com/expressjs/multer) | Handling multipart/form-data for PDF uploads in memory |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |

## 🔋 Features

- 🔐 **JWT Authentication** — Secure register, login, and protected APIs with stateless tokens
- 📄 **Custom MongoDB Storage** — Fast, reliable storage for users, resumes, and dynamic AI feedback
- 🤖 **Gemini AI Integration** — Highly capable ATS scoring and category-wise improvement tips powered by `gemini-2.5-flash`
- 🔒 **Stand-alone Backend** — Node.js/Express handles all PDF to base64 conversions securely natively
- 📱 **Responsive Design** — Fully mobile-friendly UI built with Tailwind CSS
- ⚡ **Fast Dev Experience** — Vite HMR, TypeScript, and modular architecture

## 📂 Project Structure

```
ResumePilot/
│
├── app/                          # Frontend (React Router v7)
│   ├── components/               # Reusable UI components
│   │   ├── ATS.tsx               # ATS score display
│   │   ├── Accordion.tsx         # Expandable feedback sections
│   │   ├── Details.tsx           # Resume detail view
│   │   ├── FileUploader.tsx      # Drag-and-drop file upload
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── ResumeCard.tsx        # Resume list card
│   │   ├── ScoreBadge.tsx        # Score indicator badge
│   │   ├── ScoreCircle.tsx       # Circular score visualization
│   │   ├── ScoreGauge.tsx        # Gauge-style score display
│   │   └── Summary.tsx           # Analysis summary
│   ├── lib/                      # Utilities & stores
│   │   ├── api.ts                # Fluent OOP API wrapper for Express backend
│   │   ├── store.ts              # Zustand global store for JWT Auth state
│   │   └── utils.ts              # UI utility functions
│   ├── routes/                   # Page routes
│   │   ├── auth.tsx              # Custom Login and Register UI
│   │   ├── home.tsx              # Dashboard fetching resumes from API
│   │   ├── resume.tsx            # Secure native PDF renderer and AI viewer
│   │   ├── upload.tsx            # Multi-part file upload form
│   │   └── wipe.tsx              # Cloud data wipe management
│   ├── app.css                   # Global styles
│   ├── root.tsx                  # Root layout
│   └── routes.ts                 # Route definitions
│
├── backend/                      # Backend (Express.js)
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, login, profile logic
│   │   └── resumeController.js   # Upload, analyze, list, get, and delete logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── Resume.js             # Mongoose schema for resume binary and AI data
│   │   └── User.js               # Mongoose user schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth API route definitions
│   │   └── resumeRoutes.js       # Resume/Gemini API route definitions
│   ├── services/
│   │   └── geminiService.js      # Google Generative AI integration & backoff strategy
│   ├── .env                      # Environment variables (not committed)
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
│
├── constants/                    # Shared constants & AI prompts
├── types/                        # TypeScript type definitions
├── public/                       # Static assets (icons, images)
├── package.json                  # Frontend dependencies
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
└── Dockerfile                    # Docker containerization
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/AbhayMahalle/ResumePilot.git
cd ResumePilot
```

### 2. Set Up the Frontend

```bash
npm install
npm run dev
```

The frontend will be running at [http://localhost:5173](http://localhost:5173).

### 3. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/resumeAnalyzerDB?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
```

Start the backend server:

```bash
node server.js
```

The API will be running at [http://localhost:5000](http://localhost:5000).

## 🔐 API Endpoints

### Resumes & AI Analysis (Protected Routes)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/resumes/upload` | ✅ Bearer Token | Uploads a PDF, converts it, prompts Gemini AI, and saves result |
| `GET` | `/api/resumes` | ✅ Bearer Token | Lists all resumes belonging to the user |
| `GET` | `/api/resumes/:id` | ✅ Bearer Token | Fetches complete metadata and JSON AI feedback |
| `GET` | `/api/resumes/:id/download` | ✅ Bearer Token | Safely streams the raw PDF binary back |
| `DELETE` | `/api/resumes/:id` | ✅ Bearer Token | Hard deletes the resume from MongoDB |

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ Public | Register a new user |
| `POST` | `/api/auth/login` | ❌ Public | Login and receive JWT token |
| `GET` | `/api/auth/profile` | ✅ Bearer Token | Get logged-in user's profile |

### Example Requests

**Register:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Login:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```

**Profile (Protected):**
```bash
GET /api/auth/profile
Authorization: Bearer <your_jwt_token>
```

## 📄 Environment Variables

Create a `backend/.env` file with the following variables:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Server port (default: `5000`) |

> ⚠️ **Never commit your `.env` file.** It is excluded via `.gitignore`.

## 📸 Screenshots

<div align="center">
  <img src="public/readme/hero.webp" alt="ResumePilot Hero" width="100%" />
</div>

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/AbhayMahalle">Abhay Mahalle</a></p>
</div>
