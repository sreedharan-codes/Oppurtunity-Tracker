# Oppurtunity-Tracker — Student Opportunity & Career Acceleration Platform
> **"Find what moves you forward."**  
> *A production-grade student opportunity aggregation, leaderboard ranking, and skills-first learning platform.*

---

## 🌟 Overview

**OPPORTUNITY** is a modern student productivity platform aggregating internships, hackathons, workshops, certifications, and competitions. Built with an **"Apple meets Linear"** liquid glass design philosophy, it empowers students to discover career milestones, calculate deterministic compatibility match scores, track applications across a visual Kanban pipeline, and conquer closing deadlines.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | **React 19** + **TypeScript** |
| **Build Tooling** | **Vite 8** |
| **Styling & Design System** | **Tailwind CSS 3.4** + Custom Liquid Glassmorphism Tokens |
| **Backend & Persistence** | **Firebase Web SDK v12** (Cloud Firestore + Firebase Authentication) |
| **Security** | Production-grade **Firebase Security Rules** (`firestore.rules`) |
| **Icons & Micro-interactions** | **Lucide React** + **Canvas Confetti** |
| **Fallback & Hybrid Mode** | Automatic Local Sandbox Synchronization (Zero-config review) |

---

## 💎 Design System & Visual Language

- **Liquid Glass & Frosted Surfaces**: Multi-layered backdrop blurs (`backdrop-filter: blur(24px) saturate(180%)`), translucent fills, and specular gradient borders.
- **Floating Navigation & Mobile Dock**: Centered pill floating navigation on desktop; iOS-inspired floating glass dock on mobile devices.
- **Apple-inspired Typography & Palette**: Plus Jakarta Sans & Inter font hierarchy paired with Apple blue (`#0071e3`), graphite dark mode (`#08090d`), and crisp off-white light mode.
- **Subtle Micro-interactions**: Hover elevations, active scale depressions, bookmark fill animations, and celebratory particle bursts on application status milestones.

---

## 📂 Firestore Data Models

### 1. `users/{userId}`
```typescript
{
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  college: string;
  course: string;
  year: string;
  skills: string[];               // e.g. ["Python", "React", "AI/ML", "SQL"]
  interests: string[];            // e.g. ["Artificial Intelligence", "Full-Stack"]
  preferredTypes: string[];       // ["Internship", "Hackathon", "Workshop"]
  preferredMode: "Online" | "Offline" | "Hybrid" | "Any";
  role: "student" | "admin";
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
}
```

### 2. `opportunities/{opportunityId}`
```typescript
{
  id: string;
  title: string;
  organization: string;
  organizationLogo: string;
  description: string;
  type: "Internship" | "Hackathon" | "Workshop" | "Certification" | "Competition";
  skills: string[];
  eligibility: string;
  location: string;
  mode: "Online" | "Offline" | "Hybrid";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  deadline: string;               // ISO YYYY-MM-DD format
  applicationUrl: string;
  postedAt: string;
  status: "published" | "draft" | "archived";
  stipendOrPrize?: string;
  createdBy?: string;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  bookmarkCount?: number;
}
```

### 3. `applications/{applicationId}`
*(Document ID format: `{userId}_{opportunityId}`)*
```typescript
{
  id: string;
  userId: string;
  opportunityId: string;
  status: "Interested" | "Applied" | "Shortlisted" | "Completed";
  notes?: string;
  appliedDate?: string;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
}
```

### 4. `bookmarks/{bookmarkId}`
*(Document ID format: `{userId}_{opportunityId}`)*
```typescript
{
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: string | Timestamp;
}
```

---

## 🔒 Firebase Security Rules (`firestore.rules`)

The platform implements strict role-based access control:
1. **Opportunities**:
   - Anyone can read `published` opportunities.
   - Only verified administrators can `create`, `update`, or `delete` opportunities.
2. **Applications & Bookmarks**:
   - Students can only read, create, update, or delete records belonging to their own `request.auth.uid`.
   - Normal students cannot modify or tamper with other students' records or opportunities.
3. **Profiles**:
   - Students can read and update their own profile document.

---

## ⚡ Deterministic Opportunity Matching Engine

The recommendation system calculates deterministic, transparent compatibility scores:
- **Skill Overlap (55% weight)**: Matches student skills against opportunity skill tags.
- **Type Preference (20% weight)**: Matches desired programs (e.g. Internships vs Hackathons).
- **Format Mode (15% weight)**: Compares Online / Hybrid / Offline preferences.
- **Interest Alignment (10% weight)**: Analyzes student career interests against role descriptions.
- **Human-Readable Explanations**: Generates real-time contextual rationales (e.g., *"Strong match because this opportunity directly aligns with your Python, Machine Learning expertise and hybrid mode preference."*).

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Configure Environment Variables (Optional for Live Firebase)
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in your Firebase Web App configuration from the [Firebase Console](https://console.firebase.google.com/):
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Note on Zero-Config Demo Mode**:  
> If `.env` is left blank, the application automatically runs in **Local Demo Sandbox Mode**. Every single feature (Firestore persistence, saving bookmarks, changing Kanban application stages, admin CRUD, and real-time calculations) functions seamlessly out-of-the-box using synchronized state storage. Once live Firebase credentials are added, it seamlessly switches to live Cloud Firestore!

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Hackathon Demo Flow Walkthrough

The application is pre-loaded with **22 realistic opportunities** (Google, Microsoft, AWS, IBM, NVIDIA, Adobe, GitHub, Atlassian, OpenAI, Stripe, etc.) across all 5 categories.

### Step-by-Step Demo Guide:
1. **Landing Page**:
   - Visit `http://localhost:5173/`.
   - Experience the Apple-inspired hero, floating preview card, and feature pillars.
2. **1-Click Student Login**:
   - Click **"Get Started"** or **"Sign In"**.
   - Click the **"👤 Student (Alex)"** 1-click evaluation login button.
3. **Personal Student Dashboard**:
   - Greeted by *"Good morning/afternoon, Alex"*.
   - View live metric cards: **Saved (3)**, **Applied (1)**, **Shortlisted (1)**, **Due This Week**, and **Pipeline Completion %**.
   - Check the **Upcoming Deadlines** chronological queue and **Recommended For You** list.
4. **Opportunity Discovery (Explore)**:
   - Click **"Explore"** in the top navigation.
   - Type `"AI"` in the search bar — witness instant debounced filtering.
   - Filter by **Internships** or **Remote/Hybrid**.
5. **Opportunity Inspection & Matching**:
   - Click **"View"** on *Google AI/ML Research Internship*.
   - Inspect the **92% Compatibility Analysis** explaining the skill match.
   - Click **"Save"** to toggle bookmark (with confetti feedback!).
   - Change the application status dropdown to **"Applied"**.
6. **Kanban Application Tracker**:
   - Click **"Applications"** in the navigation bar.
   - View the 4 columns: **Interested**, **Applied**, **Shortlisted**, **Completed**.
   - Move an opportunity to the next stage by clicking **"Advance"** or move back.
7. **Saved Opportunities**:
   - Click **"Saved"** to view all bookmarked opportunities.
8. **Student Profile**:
   - Click **"Profile"** to inspect the profile completeness bar (90%), add/remove technical skill tags, or change academic details.
9. **Admin Workflow**:
   - In the navigation bar, toggle the role switcher from **"Student"** to **"Admin"** (or sign in as **Sarah Connor - admin@opportunity.io**).
   - Click **"Admin"** to open the **Admin Platform Console**.
   - View metrics: Total Opportunities (22), Published (22), Student Applications, and Deadlines.
   - Click **"Add Opportunity"** to create a new program.
   - Fill in details and click **"Publish Opportunity"**.
   - Switch back to the **Student** view and verify the newly published opportunity appears in the **Explore** tab!

---

## 👑 Demo Accounts

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Student** | Alex Chen (Stanford CS) | `alex.chen@university.edu` | `password123` |
| **Admin** | Sarah Connor (Platform Admin) | `admin@opportunity.io` | `admin123` |

*(Fast 1-click login buttons are also provided directly inside the Sign In modal for frictionless evaluation).*

---

## 📜 License
MIT License. Built for the Vision2Web Hackathon.
