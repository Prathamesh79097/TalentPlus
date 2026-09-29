# TalentPulse – Recruitment Management System

> A full-stack Recruitment Management System built with **Spring Boot**, **Firebase (Firestore + Auth + Storage)**, and a modern **Stitch UI**-inspired frontend.

## 🗂️ Project Structure

```
RecruitX/
├── frontend/                   ← Frontend (SPA - HTML/JS/Tailwind)
│   ├── index.html              ← Main SPA shell (nav, auth, routing)
│   ├── js/
│   │   └── app.js              ← Router, API helper, utilities
│   └── pages/
│       ├── login.js            ← Authentication (sign in / sign up)
│       ├── dashboard.js        ← Dashboard (KPIs, funnel, interviews)
│       ├── job-openings.js     ← Job postings (table + mobile cards)
│       ├── applicants.js       ← Candidate list + add candidate
│       ├── screening.js        ← Kanban board / screening stage
│       ├── interviews.js       ← Schedule + week view
│       ├── selection.js        ← Final selection + hire decisions
│       ├── job-offers.js       ← Offer management
│       ├── candidate-profile.js← Full candidate detail view
│       ├── reports.js          ← Analytics & reports
│       └── settings.js         ← User settings
│
└── backend/                    ← Spring Boot Backend
    ├── pom.xml                 ← Maven dependencies
    └── src/main/java/com/recruitx/
        ├── TalentPulseApplication.java
        ├── config/
        │   ├── FirebaseConfig.java      ← Firebase Admin SDK init
        │   └── SecurityConfig.java      ← Spring Security + CORS
        ├── security/
        │   ├── FirebaseAuthFilter.java  ← JWT verification filter
        │   └── FirebaseUserDetails.java
        ├── service/
        │   └── FirestoreService.java    ← Generic Firestore CRUD
        └── controller/
            ├── DashboardController.java ← GET /api/dashboard/stats
            ├── JobController.java       ← /api/jobs
            ├── ApplicantController.java ← /api/applicants
            ├── InterviewController.java ← /api/interviews
            ├── OfferController.java     ← /api/offers
            └── ActivityController.java  ← /api/activity, /api/users
```

---

## 🚀 Setup Guide

### Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable **Authentication** → Sign-in method → **Email/Password**
4. Enable **Firestore Database** → Start in production mode
5. Enable **Storage** (for resume uploads)
6. Get Web app config:
   - Project Settings → Your apps → Add app → Web → Copy config
7. Get Service Account for backend:
   - Project Settings → Service Accounts → **Generate new private key** → Download JSON

### Step 2: Configure Frontend

Open `frontend/index.html` and replace the Firebase config placeholder:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",          // ← Replace with your actual values
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

### Step 3: Configure Backend

1. Copy the downloaded service account JSON to:
   ```
   backend/src/main/resources/firebase-service-account.json
   ```

2. Update `backend/src/main/resources/application.yml`:
   ```yaml
   firebase:
     project-id: your-firebase-project-id
   ```

### Step 4: Run the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`

### Step 5: Run the Frontend

```bash
# Option 1: VS Code Live Server (right-click index.html → Open with Live Server)
# Option 2: Python HTTP server
cd frontend
python -m http.server 5500
# Then open: http://localhost:5500
```

### Step 6: Test the App

1. Open the frontend URL
2. Click **Sign Up** to create your account
3. Log in to see the full dashboard

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | KPI metrics |
| GET | `/api/jobs` | List all jobs |
| POST | `/api/jobs` | Create job |
| PUT | `/api/jobs/{id}` | Update job |
| DELETE | `/api/jobs/{id}` | Delete job |
| GET | `/api/applicants` | List candidates |
| POST | `/api/applicants` | Add candidate |
| PATCH | `/api/applicants/{id}/stage` | Update stage |
| PATCH | `/api/applicants/{id}/rating` | Update rating |
| GET | `/api/applicants/{id}/notes` | Get notes |
| POST | `/api/applicants/{id}/notes` | Add note |
| GET | `/api/interviews` | List interviews |
| GET | `/api/interviews/today` | Today's interviews |
| POST | `/api/interviews` | Schedule interview |
| PATCH | `/api/interviews/{id}/cancel` | Cancel interview |
| GET | `/api/offers` | List offers |
| POST | `/api/offers` | Send offer |
| PATCH | `/api/offers/{id}/status` | Accept/Decline offer |
| GET | `/api/activity/recent` | Recent activity |

---

## 🗄️ Firestore Collections

| Collection | Description |
|-----------|-------------|
| `users` | User profiles |
| `jobs` | Job postings |
| `applicants` | Candidate profiles |
| `applicants/{id}/notes` | Candidate notes (subcollection) |
| `interviews` | Interview schedules |
| `offers` | Job offers |
| `activities` | Activity log |

---

## ✨ Features

- 🔐 **Firebase Authentication** (Email/Password)
- 📊 **Dashboard** with live KPIs & candidate funnel
- 💼 **Job Openings** – Post, edit, delete, filter jobs
- 👥 **Applicants** – Add candidates, upload resumes to Firebase Storage
- 🔍 **Screening** – Kanban board for shortlisting
- 📅 **Interviews** – Schedule with week view, video links
- ✅ **Selection** – Final hire/reject decisions with assessment
- 📋 **Job Offers** – Send, accept, decline offers
- 📧 **Automated Candidate Email Confirmations** – Instant email receipt sent to applicants when applying via Google Forms / direct application
- 📈 **Reports** – Department & stage analytics
- 📱 **Responsive** – Fully responsive desktop + mobile design
