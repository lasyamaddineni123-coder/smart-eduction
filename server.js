const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./data/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 1. AUTHENTICATION & PROFILE ROUTES
// ==========================================

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, grade, major } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user = db.createUser({ name, email, password, grade, major });
  const { password: _, ...safeUser } = user;
  res.status(201).json({ message: 'Registration successful', user: safeUser });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ message: 'Login successful', user: safeUser });
});

// Get Current User Profile
app.get('/api/auth/me', (req, res) => {
  const userId = req.headers['x-user-id'] || 'usr_demo';
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Update Profile
app.put('/api/auth/profile', (req, res) => {
  const userId = req.headers['x-user-id'] || req.body.id;
  if (!userId) {
    return res.status(400).json({ error: 'User ID missing' });
  }
  const updated = db.updateUser(userId, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password: _, ...safeUser } = updated;
  res.json({ message: 'Profile updated successfully', user: safeUser });
});

// ==========================================
// 2. ONLINE COURSES ROUTES
// ==========================================

// Get All Courses with optional query filtering
app.get('/api/courses', (req, res) => {
  let courses = db.getCourses();
  const { category, search, level } = req.query;

  if (category && category !== 'All') {
    courses = courses.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }
  if (level && level !== 'All') {
    courses = courses.filter(c => c.level.toLowerCase().includes(level.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    courses = courses.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.instructor.name.toLowerCase().includes(q)
    );
  }
  res.json(courses);
});

// Get Course by ID
app.get('/api/courses/:id', (req, res) => {
  const course = db.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

// Enroll in a Course
app.post('/api/courses/:id/enroll', (req, res) => {
  const userId = req.headers['x-user-id'] || req.body.userId || 'usr_demo';
  const updatedUser = db.enrollCourse(userId, req.params.id);
  if (!updatedUser) {
    return res.status(404).json({ error: 'Failed to enroll: User not found' });
  }
  const { password: _, ...safeUser } = updatedUser;
  res.json({ message: 'Enrolled successfully!', user: safeUser });
});

// Mark Lesson Completed
app.post('/api/courses/:id/complete-lesson', (req, res) => {
  const userId = req.headers['x-user-id'] || req.body.userId || 'usr_demo';
  const { lessonId } = req.body;
  if (!lessonId) {
    return res.status(400).json({ error: 'lessonId is required' });
  }
  const updatedUser = db.completeLesson(userId, req.params.id, lessonId);
  if (!updatedUser) {
    return res.status(404).json({ error: 'Failed to update lesson' });
  }
  const { password: _, ...safeUser } = updatedUser;
  res.json({ message: 'Lesson completed!', user: safeUser });
});

// ==========================================
// 3. STUDY MATERIALS ROUTES
// ==========================================

app.get('/api/materials', (req, res) => {
  let materials = db.getMaterials();
  const { subject, type, search } = req.query;

  if (subject && subject !== 'All') {
    materials = materials.filter(m => m.subject.toLowerCase() === subject.toLowerCase());
  }
  if (type && type !== 'All') {
    materials = materials.filter(m => m.type.toLowerCase() === type.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    materials = materials.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  }
  res.json(materials);
});

app.get('/api/materials/:id', (req, res) => {
  const mat = db.getMaterialById(req.params.id);
  if (!mat) {
    return res.status(404).json({ error: 'Study material not found' });
  }
  res.json(mat);
});

// ==========================================
// 4. ONLINE EXAMS & QUIZZES ROUTES
// ==========================================

app.get('/api/exams', (req, res) => {
  const exams = db.getExams().map(e => ({
    id: e.id,
    title: e.title,
    category: e.category,
    durationMinutes: e.durationMinutes,
    totalMarks: e.totalMarks,
    passingMarks: e.passingMarks,
    description: e.description,
    totalQuestions: e.questions.length
  }));
  res.json(exams);
});

app.get('/api/exams/:id', (req, res) => {
  const exam = db.getExamById(req.params.id);
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }
  // Sanitize answers so client doesn't cheat during test
  const questionsWithoutAnswers = exam.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));

  res.json({
    ...exam,
    questions: questionsWithoutAnswers
  });
});

// Submit Exam & Auto Calculate Results
app.post('/api/exams/:id/submit', (req, res) => {
  const exam = db.getExamById(req.params.id);
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }

  const { answers, timeSpent } = req.body; // { qId: selectedOptionIndex }
  const userId = req.headers['x-user-id'] || req.body.userId || 'usr_demo';

  let correctCount = 0;
  const detailedBreakdown = exam.questions.map(q => {
    const studentAnswerIndex = answers ? answers[q.id] : undefined;
    const isCorrect = studentAnswerIndex === q.correctIndex;
    if (isCorrect) correctCount++;

    return {
      id: q.id,
      question: q.question,
      options: q.options,
      studentAnswerIndex,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    };
  });

  const totalQuestions = exam.questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const status = score >= exam.passingMarks ? 'Passed' : 'Failed';
  let grade = 'F';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 60) grade = 'C';
  else if (score >= 50) grade = 'D';

  const examResult = {
    examId: exam.id,
    examTitle: exam.title,
    score,
    totalQuestions,
    correctAnswers: correctCount,
    timeSpent: timeSpent || '05:00',
    grade,
    status
  };

  const updatedUser = db.recordExamResult(userId, examResult);

  res.json({
    result: examResult,
    breakdown: detailedBreakdown,
    user: updatedUser ? {
      examResults: updatedUser.examResults,
      badges: updatedUser.badges
    } : null
  });
});

// ==========================================
// 5. AI LEARNING ASSISTANT ("EduBot")
// ==========================================

const AI_KNOWLEDGE_BASE = [
  {
    keywords: ['recursion', 'recursive'],
    topic: 'Recursion',
    response: `### 🔄 Understanding Recursion in Simple Terms\n\nImagine you have a big stack of nesting Russian dolls (Matryoshka dolls). You want to find a tiny piece of candy hidden in the smallest doll.\n\n1. **Base Case (Stopping Condition)**: If you open a doll and find the candy (or the doll cannot be opened anymore), you stop!\n2. **Recursive Step**: If the doll is not the smallest, you open it and do the exact same action on the smaller doll inside.\n\n\`\`\`python\ndef find_doll(doll):\n    # Base case\n    if doll.is_smallest:\n        return "Found the center!"\n    # Recursive call\n    return find_doll(doll.inner_doll)\n\`\`\`\n\n**Key Rule**: Always ensure you have a base case, otherwise you'll run into a "Stack Overflow" error!`
  },
  {
    keywords: ['quantum', 'superposition', 'schrodinger'],
    topic: 'Quantum Physics & Superposition',
    response: `### ⚛️ Quantum Superposition Explained Simply\n\nIn everyday life, a coin resting on a table is either **Heads** (1) or **Tails** (0).\n\nNow, imagine you spin that coin on the table! While it is rapidly spinning, is it Heads or Tails? It is a continuous blend of **both at the same time**.\n\n- In normal computing, a **bit** is either 0 or 1.\n- In quantum computing, a **qubit** can exist in a superposition of both 0 and 1 until we measure (observe) it.\n- When measured, the wave function collapses into a definite state (Heads or Tails)!`
  },
  {
    keywords: ['calculus', 'derivative', 'integral', 'limit'],
    topic: 'Calculus Essentials',
    response: `### 📐 What is Calculus Really About?\n\nCalculus is simply the mathematics of **change and accumulation**:\n\n1. **Derivatives (Speedometer)**:\n   - Tells you how fast something is changing *right now* at an exact instant.\n   - E.g., looking at your car's speedometer at 2:15 PM tells you your instantaneous velocity.\n\n2. **Integrals (Odometer)**:\n   - Tells you how much has accumulated over time.\n   - E.g., adding up every tiny fraction of a mile driven over 2 hours gives your total distance.\n\n**Golden Formula**:\n- Power Rule for derivatives: d/dx [x^n] = n * x^(n-1)\n- Power Rule for integrals: integral(x^n dx) = (x^(n+1))/(n+1) + C`
  },
  {
    keywords: ['study plan', 'schedule', 'roadmap', 'exam preparation', 'timetable'],
    topic: 'Personalized Study Plan',
    response: `### 📅 Smart 7-Day Exam Preparation Strategy\n\nHere is an optimized study plan utilizing the Pomodoro and Spaced Repetition techniques:\n\n- **Days 1–2: Concept Mapping & Core Theory**\n  - Morning (2 hrs): Review fundamental definitions and formulas.\n  - Afternoon (2 hrs): Watch recorded video lectures on weak topics.\n- **Days 3–4: Hands-on Problem Solving**\n  - Practice chapter-wise exercises without looking at solutions first.\n  - Create condensed one-page cheat sheets for quick reference.\n- **Day 5: Previous Year Question Papers (PYQs)**\n  - Solve a full 2023 or 2024 paper under strict timed conditions (simulate the exam).\n- **Day 6: Gap Analysis & Weak Spot Review**\n  - Focus solely on the questions you missed in Day 5.\n  - Ask EduBot to clarify lingering doubts.\n- **Day 7: Light Review & Mental Rest**\n  - Skim formula sheets, get 8 hours of sleep, and stay hydrated!`
  },
  {
    keywords: ['quiz me', 'test me', 'questions', 'practice question'],
    topic: 'Interactive Practice Quiz',
    response: `### 🎯 Quick Knowledge Check Challenge!\n\nHere are 3 quick questions for you. Try answering them in your head or in the chat:\n\n1. **Question 1 (Logic)**: What is the time complexity of searching an element in a binary search tree (BST) in the average case?\n   - *A) O(1)* | *B) O(log n)* | *C) O(n)*\n\n2. **Question 2 (Web)**: Which HTTP method is typically used to update an existing resource idempotently?\n   - *A) GET* | *B) POST* | *C) PUT*\n\n3. **Question 3 (Physics)**: What physical quantity is represented by the slope of a Velocity vs Time graph?\n   - *A) Displacement* | *B) Acceleration* | *C) Momentum*\n\n*(Type "Reveal answers" or share your choices to check!)*`
  },
  {
    keywords: ['sql', 'database', 'nosql', 'firebase', 'mysql'],
    topic: 'Databases: SQL vs NoSQL',
    response: `### 🗄️ SQL vs NoSQL: Which Should You Choose?\n\n- **SQL (Relational - e.g., MySQL, PostgreSQL)**:\n  - Organized like spreadsheets with fixed columns (tables & rows).\n  - Strict schemas and ACID transactions.\n  - Best for: Banking, eCommerce orders, applications requiring complex relational JOINs.\n\n- **NoSQL (Document/Key-Value - e.g., MongoDB, Firebase)**:\n  - Organized like flexible JSON objects.\n  - Easily scales horizontally across distributed clusters.\n  - Best for: Real-time chat, rapid prototypes, unstructured sensor feeds.`
  }
];

app.post('/api/ai/chat', (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const query = message.toLowerCase().trim();

  // Search knowledge base
  const matched = AI_KNOWLEDGE_BASE.find(item =>
    item.keywords.some(k => query.includes(k))
  );

  let reply;
  if (matched) {
    reply = matched.response;
  } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    reply = `### 👋 Hello! I'm your Smart Education AI Tutor.\n\nI can help you with:\n1. **Explaining difficult topics** in simple terms with analogies (Calculus, Quantum Physics, Algorithms, Web Dev).\n2. **Generating practice quizzes** to test your knowledge.\n3. **Creating personalized study plans** and revision roadmaps.\n4. **Debugging code or solving math formulas**.\n\nWhat topic would you like to explore today?`;
  } else {
    // Dynamic helpful educational assistant response
    reply = `### 💡 Smart Tutor Explanation\n\nGreat question regarding **"${message}"**!\n\nHere is a structured breakdown to master this concept:\n\n1. **The Core Concept**: At its heart, this concept solves a specific challenge by breaking it into organized, repeatable components.\n2. **Real-World Analogy**: Think of it like a library sorting system: when books are categorized systematically, finding what you need takes seconds instead of hours.\n3. **Practical Application**: In your coursework and exams, you will frequently see this applied in problem-solving and analytical questions.\n4. **Key Takeaway**: Master the underlying fundamentals first before memorizing specialized formulas.\n\n💡 *Tip: Try asking me "Quiz me on this" or "Give me a 7-day study plan" to test your knowledge!*`;
  }

  res.json({
    reply,
    suggestions: [
      "Explain recursion in simple terms",
      "Give me a 7-day study plan",
      "Quiz me with 3 questions",
      "What is the difference between SQL and NoSQL?"
    ]
  });
});

// ==========================================
// 6. FEEDBACK & CONTACT ROUTES
// ==========================================

app.get('/api/feedbacks', (req, res) => {
  res.json(db.getFeedbacks());
});

app.post('/api/feedbacks', (req, res) => {
  const { name, role, rating, message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Feedback message is required' });
  }
  const feedback = db.addFeedback({ name, role, rating, message });
  res.status(201).json({ message: 'Feedback submitted successfully', feedback });
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message, category } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  const contactMsg = db.addContactMessage({ name, email, subject, message, category });
  res.status(201).json({
    message: 'Thank you! Your message has been received. Our academic counselors will respond within 24 hours.',
    data: contactMsg
  });
});

// Fallback to index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Smart Education System Server running!`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📚 APIs & Static files served seamlessly.`);
  console.log(`===============================================`);
});
