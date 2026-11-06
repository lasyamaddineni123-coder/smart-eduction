# 🎓 SMART EDUCATION SYSTEM

> **"Learn Smart, Grow Smart."**  
> A modern, attractive, and user-friendly Smart Education platform designed to empower students through digital technology, interactive video learning, automated exam assessments, verifiable notes, and AI-powered tutoring.

---

## 🌟 Key Features

### 1. Home Page & Brand Experience
- **Hero Banner:** Features the signature tagline *"Learn Smart, Grow Smart."*, live statistics counter (50,000+ Students, 1,200+ Video Lectures, 98.4% Pass Rate, 4.9/5 Rating), and interactive previews.
- **Brand Logo:** Distinctive SmartEdu glowing badge with high-resolution iconography.
- **Navigation Bar:** Direct one-click routing to Home, Courses, Study Materials, Exams, Student Dashboard, About Us, and Contact, plus a dedicated AI Tutor shortcut and user profile indicator.
- **Feature Showcase:** Highlights 4 core pillars: Interactive Classrooms, AI Academic Mentor, Real-time Exam Simulator, and Downloadable Study Notes.
- **Student Testimonials:** Verified reviews from real learners.

### 2. Student Authentication & Profile
- **Registration Form:** Student signup with educational level (High School, Undergraduate, Postgraduate, Self-Learner) and target major.
- **Secure Login:** Email & password authentication.
- **1-Click Demo Login:** Instant test drive as pre-configured student *Alex Johnson* (`alex.student@smartedu.com` / `password123`).
- **Student Profile Management:** Edit name, academic level, and target subject directly from the dashboard.

### 3. Online Courses & Interactive Video Classroom
- **Rich Catalog:** Multi-subject filtering (*Computer Science, Artificial Intelligence, Mathematics, Science & Physics, Programming*).
- **Search & Level Tags:** Instant keyword search with level badges (*Beginner, Intermediate, Advanced*).
- **Interactive Classroom Modal:**
  - Embedded video player with responsive 16:9 aspect ratio.
  - Interactive syllabus playlist (Lessons 1 to 5) with durations.
  - **"Mark Lesson Complete" Button:** Updates course progress bars in real-time and logs study hours.
  - **Classroom Tabs:** Lesson Overview, Key Formulas & Notes, and an interactive Doubt Discussion forum.

### 4. Study Materials Hub & PDF Generator
- **Downloadable PDF Notes:** One-click generation and instant download of printable PDF revision sheets (using `jsPDF`).
- **Subject-wise Categorization:** Computer Science, Engineering Mathematics, Quantum Physics, AI & Machine Learning.
- **Previous Year Question Papers (PYQs):** 2024 and 2023 semester board papers with model solutions.
- **Important Q&A Accordion:** High-probability exam questions with collapsible answers and concept summaries.
- **In-Browser Preview:** Instant reader modal allowing students to read materials before downloading.

### 5. Online Examination & MCQ Engine
- **Timed Practice Tests:** 10-15 high quality multiple-choice questions per exam with countdown clocks.
- **Interactive Question Palette:** Visual tracking of questions (Current, Answered in green, Flagged for review in orange, Unanswered).
- **Instant Result Calculation:** Automatic grading, percentage calculation, pass/fail status, and letter grades (A+, A, B, etc.).
- **Detailed Question Review:** Comprehensive breakdown showing student's choice vs correct answer with explanations.
- **Official Certificate of Achievement:** Dynamic certificate generator creating an official Certificate of Completion with student name, score, and verification seal.

### 6. Student Dashboard & Analytics
- **Personalized Profile Banner:** Displays student name, avatar, enrolled grade, major, and continuous study streak (🔥 7 Days).
- **Metric Cards:** Enrolled courses count, completed lessons, average exam score %, and study hours.
- **Course Progress Bars:** Visual percentage tracking with a 1-click "Continue Learning" button.
- **Exam History Table:** Scores, dates, status pills, and retake shortcuts.
- **Milestone Badges:** Unlocked achievements (*Fast Starter, Quiz Champion, Consistent Learner, High Achiever*).
- **Interactive Study Checklist:** Daily target checkboxes with strike-through completion.

### 7. AI Learning Assistant ("EduBot")
- **Dual Availability:** Dedicated full-screen AI study portal + Floating interactive bot widget on every page.
- **Core Capabilities:**
  1. Explaining complex topics in simple language with real-world analogies (recursion, calculus, quantum physics, databases).
  2. Generating personalized 7-day study plans.
  3. Interactive on-the-fly 3-question quizzes.
- **Quick Prompt Chips:** 1-click suggested prompts.

### 8. Contact & Student Feedback
- **Contact Form:** Categories for Course Inquiries, Technical Support, and Counseling.
- **Direct Contacts:** Support email, toll-free hotline, campus address, and 24/7 support hours.
- **Interactive 5-Star Feedback:** Star rating selector with live feedback submission that updates the testimonials feed in real-time.

---

## 🎨 Design System
- **Color Palette:**
  - Primary Blue: `#2563EB`, `#1D4ED8`, `#3B82F6`
  - Light Purple / Violet: `#7C3AED`, `#8B5CF6`, `#EDE9FE`, `#F5F3FF`
  - Crisp White & Slate: `#FFFFFF`, `#F8FAFC`, `#0F172A`, `#475569`
- **Typography:** `Plus Jakarta Sans` (headings) and `Inter` (body).
- **Responsiveness:** Full responsive layout for Desktop, Tablet, and Mobile, including a dedicated **Mobile Bottom Navigation Bar**.

---

## 🛠️ Technology Stack
- **Frontend:** Semantic HTML5, Modular CSS3 (Custom properties, Flexbox, Grid), Modern JavaScript (ES6+).
- **Backend:** Node.js + Express.js REST API.
- **Data Layer:** Persistent JSON Database (`data/database.json` & `data/db.js`) with LocalStorage fallback.
- **Libraries:**
  - [Font Awesome 6.5.1](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css)
  - [jsPDF](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)
  - [Canvas Confetti](https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js)

---

## 🚀 How to Run

### Option 1: Start the Server (Recommended)
```bash
npm start
```
Then open your browser and navigate to:
```
http://localhost:5000
```

### Option 2: Run directly in any browser
Double click or open `public/index.html` in Chrome, Edge, Firefox, or Safari. The built-in client fallback layer guarantees all features work even without a running server!

---

## 🔑 Demo Credentials
- **Email:** `alex.student@smartedu.com`
- **Password:** `password123`
- *(Or simply click the **"1-Click Demo Login"** button on the sign-in modal)*

