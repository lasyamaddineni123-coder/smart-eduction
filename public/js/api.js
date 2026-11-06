/**
 * SMART EDUCATION SYSTEM - HYBRID API & PERSISTENT CLIENT STORAGE
 * Automatically connects to Express backend when available, and
 * provides seamless offline / standalone LocalStorage fallback so the
 * site always works whether hosted on a server or opened directly in a browser.
 */

class ApiService {
  constructor() {
    this.userId = localStorage.getItem('smartedu_user_id') || 'usr_demo';
    this.isStandalone = window.location.protocol === 'file:' || !window.location.origin.includes('http');
    this.initLocalStorage();
  }

  initLocalStorage() {
    if (!localStorage.getItem('smartedu_courses')) {
      localStorage.setItem('smartedu_courses', JSON.stringify(typeof DEFAULT_COURSES !== 'undefined' ? DEFAULT_COURSES : []));
    }
    if (!localStorage.getItem('smartedu_materials')) {
      localStorage.setItem('smartedu_materials', JSON.stringify(typeof DEFAULT_MATERIALS !== 'undefined' ? DEFAULT_MATERIALS : []));
    }
    if (!localStorage.getItem('smartedu_exams')) {
      localStorage.setItem('smartedu_exams', JSON.stringify(typeof DEFAULT_EXAMS !== 'undefined' ? DEFAULT_EXAMS : []));
    }
    if (!localStorage.getItem('smartedu_feedbacks')) {
      localStorage.setItem('smartedu_feedbacks', JSON.stringify(typeof DEFAULT_FEEDBACKS !== 'undefined' ? DEFAULT_FEEDBACKS : []));
    }
    if (!localStorage.getItem('smartedu_user')) {
      localStorage.setItem('smartedu_user', JSON.stringify(typeof DEFAULT_USER !== 'undefined' ? DEFAULT_USER : null));
    }
  }

  setUserId(id) {
    this.userId = id;
    if (id) {
      localStorage.setItem('smartedu_user_id', id);
    } else {
      localStorage.removeItem('smartedu_user_id');
    }
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-user-id': this.userId || 'usr_demo'
    };
  }

  async request(endpoint, options = {}) {
    if (this.isStandalone) {
      throw new Error('Standalone mode: using local storage');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(endpoint, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {})
        }
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  // Auth & Profile
  async login(email, password) {
    try {
      return await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    } catch (e) {
      // Offline fallback authentication
      const user = JSON.parse(localStorage.getItem('smartedu_user')) || DEFAULT_USER;
      if (email === user.email && password === 'password123') {
        return { message: 'Login successful', user };
      } else if (email) {
        user.email = email;
        user.name = email.split('@')[0].replace('.', ' ');
        localStorage.setItem('smartedu_user', JSON.stringify(user));
        return { message: 'Login successful', user };
      }
      throw new Error('Invalid credentials');
    }
  }

  async register(userData) {
    try {
      return await this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    } catch (e) {
      const newUser = {
        ...DEFAULT_USER,
        id: 'usr_' + Date.now(),
        name: userData.name,
        email: userData.email,
        grade: userData.grade || 'Undergraduate',
        major: userData.major || 'Computer Science',
        streak: 1,
        studyHours: 0,
        enrolledCourses: [],
        examResults: [],
        badges: [{ id: 'b-welcome', title: 'Smart Explorer', icon: 'fa-compass', desc: 'Joined SmartEdu' }]
      };
      localStorage.setItem('smartedu_user', JSON.stringify(newUser));
      return { message: 'Registration successful', user: newUser };
    }
  }

  async getCurrentUser() {
    try {
      return await this.request('/api/auth/me');
    } catch (e) {
      const user = JSON.parse(localStorage.getItem('smartedu_user')) || DEFAULT_USER;
      return { user };
    }
  }

  async updateProfile(updates) {
    try {
      return await this.request('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    } catch (e) {
      const user = JSON.parse(localStorage.getItem('smartedu_user')) || DEFAULT_USER;
      Object.assign(user, updates);
      localStorage.setItem('smartedu_user', JSON.stringify(user));
      return { message: 'Profile updated', user };
    }
  }

  // Courses
  async getCourses(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      return await this.request(`/api/courses?${params.toString()}`);
    } catch (e) {
      return JSON.parse(localStorage.getItem('smartedu_courses')) || DEFAULT_COURSES;
    }
  }

  async getCourseById(id) {
    try {
      return await this.request(`/api/courses/${id}`);
    } catch (e) {
      const courses = JSON.parse(localStorage.getItem('smartedu_courses')) || DEFAULT_COURSES;
      return courses.find(c => c.id === id);
    }
  }

  async enrollCourse(courseId) {
    try {
      return await this.request(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        body: JSON.stringify({ userId: this.userId })
      });
    } catch (e) {
      const user = JSON.parse(localStorage.getItem('smartedu_user')) || DEFAULT_USER;
      if (!user.enrolledCourses) user.enrolledCourses = [];
      if (!user.enrolledCourses.some(c => c.courseId === courseId)) {
        user.enrolledCourses.push({
          courseId,
          completedLessons: [],
          progress: 0
        });
        localStorage.setItem('smartedu_user', JSON.stringify(user));
      }
      return { message: 'Enrolled successfully', user };
    }
  }

  async completeLesson(courseId, lessonId) {
    try {
      return await this.request(`/api/courses/${courseId}/complete-lesson`, {
        method: 'POST',
        body: JSON.stringify({ lessonId, userId: this.userId })
      });
    } catch (e) {
      const user = JSON.parse(localStorage.getItem('smartedu_user')) || DEFAULT_USER;
      let enrolled = user.enrolledCourses?.find(c => c.courseId === courseId);
      if (!enrolled) {
        enrolled = { courseId, completedLessons: [lessonId], progress: 20 };
        user.enrolledCourses.push(enrolled);
      } else {
        if (!enrolled.completedLessons.includes(lessonId)) {
          enrolled.completedLessons.push(lessonId);
        }
        enrolled.progress = Math.min(100, Math.round((enrolled.completedLessons.length / 5) * 100));
      }
      user.studyHours = Math.round(((user.studyHours || 0) + 0.5) * 10) / 10;
      localStorage.setItem('smartedu_user', JSON.stringify(user));
      return { message: 'Lesson completed', user };
    }
  }

  // Study Materials
  async getMaterials(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      return await this.request(`/api/materials?${params.toString()}`);
    } catch (e) {
      return JSON.parse(localStorage.getItem('smartedu_materials')) || DEFAULT_MATERIALS;
    }
  }

  async getMaterialById(id) {
    try {
      return await this.request(`/api/materials/${id}`);
    } catch (e) {
      const mats = JSON.parse(localStorage.getItem('smartedu_materials')) || DEFAULT_MATERIALS;
      return mats.find(m => m.id === id);
    }
  }

  // Exams
  async getExams() {
    try {
      return await this.request('/api/exams');
    } catch (e) {
      return JSON.parse(localStorage.getItem('smartedu_exams')) || DEFAULT_EXAMS;
    }
  }

  async getExamById(id) {
    try {
      return await this.request(`/api/exams/${id}`);
    } catch (e) {
      const exams = JSON.parse(localStorage.getItem('smartedu_exams')) || DEFAULT_EXAMS;
      return exams.find(e => e.id === id);
    }
  }

  async submitExam(examId, answers, timeSpent) {
    try {
      return await this.request(`/api/exams/${examId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers, timeSpent, userId: this.userId })
      });
    } catch (e) {
      // Offline automatic grading
      const exams = JSON.parse(localStorage.getItem('smartedu_exams')) || DEFAULT_EXAMS;
      const exam = exams.find(ex => ex.id === examId) || DEFAULT_EXAMS[0];

      let correctCount = 0;
      const breakdown = exam.questions.map(q => {
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
      const status = score >= (exam.passingMarks || 60) ? 'Passed' : 'Failed';
      let grade = 'F';
      if (score >= 90) grade = 'A+';
      else if (score >= 80) grade = 'A';
      else if (score >= 70) grade = 'B';
      else if (score >= 60) grade = 'C';

      const result = {
        examId: exam.id,
        examTitle: exam.title,
        score,
        totalQuestions,
        correctAnswers: correctCount,
        timeSpent: timeSpent || '08:30',
        grade,
        status,
        date: new Date().toISOString().split('T')[0]
      };

      const user = JSON.parse(localStorage.getItem('smartedu_user')) || DEFAULT_USER;
      if (!user.examResults) user.examResults = [];
      user.examResults.unshift(result);
      if (score >= 80 && !user.badges.some(b => b.id === 'b-high-scorer')) {
        user.badges.push({ id: 'b-high-scorer', title: 'High Achiever', icon: 'fa-award', desc: 'Scored 80%+ on official exam' });
      }
      localStorage.setItem('smartedu_user', JSON.stringify(user));

      return { result, breakdown, user };
    }
  }

  // AI Learning Assistant
  async askAi(message, history = []) {
    try {
      return await this.request('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history })
      });
    } catch (e) {
      const query = message.toLowerCase().trim();
      let reply = '';

      if (query.includes('recursion')) {
        reply = `### 🔄 Recursion Explained Simply\n\nThink of Russian nesting dolls! You open a doll, and if there is a smaller doll inside, you repeat the exact same action (**Recursive Step**). When you reach the smallest solid doll with no doll inside, you stop (**Base Case**).\n\n\`\`\`python\ndef open_doll(doll):\n    if doll.is_smallest:\n        return "Done!"\n    return open_doll(doll.smaller_doll)\n\`\`\``;
      } else if (query.includes('plan') || query.includes('schedule') || query.includes('roadmap')) {
        reply = `### 📅 Smart 7-Day Study Plan\n\n- **Days 1-2**: Conceptual fundamentals & video lectures.\n- **Days 3-4**: Active problem solving and formula sheets.\n- **Day 5**: Solve 2024 Previous Year Question Papers (PYQs) under timed test mode.\n- **Day 6**: Review weak areas & practice with EduBot.\n- **Day 7**: Formula cheat-sheet revision & good rest!`;
      } else if (query.includes('quiz')) {
        reply = `### 🎯 Quick 3-Question Practice Challenge\n\n1. **Q1 (DSA)**: What is the average lookup time of a hash table? *(A: O(1) | B: O(n))*\n2. **Q2 (Web)**: What does HTTP 201 Created signify?\n3. **Q3 (Math)**: What is the derivative of e^(2x)? *(A: 2*e^(2x) | B: e^(2x))*`;
      } else if (query.includes('quantum') || query.includes('superposition')) {
        reply = `### ⚛️ Quantum Superposition\n\nImagine a spinning coin on a table. While spinning, it is both Heads AND Tails simultaneously! Only when you slap your hand down (measure it), does it collapse into a single definite state. That is superposition.`;
      } else {
        reply = `### 💡 Smart Tutor Explanation\n\nGreat question regarding **"${message}"**!\n\n1. **Core Concept**: Break this topic into foundational rules before solving complex applications.\n2. **Analogy**: Imagine learning to swim—first you practice kicking and breathing before swimming across the lake.\n3. **Action Step**: Check the Study Materials tab for downloadable revision sheets!`;
      }

      return { reply };
    }
  }

  // Feedback & Contact
  async getFeedbacks() {
    try {
      return await this.request('/api/feedbacks');
    } catch (e) {
      return JSON.parse(localStorage.getItem('smartedu_feedbacks')) || DEFAULT_FEEDBACKS;
    }
  }

  async submitFeedback(feedbackData) {
    try {
      return await this.request('/api/feedbacks', {
        method: 'POST',
        body: JSON.stringify(feedbackData)
      });
    } catch (e) {
      const feedbacks = JSON.parse(localStorage.getItem('smartedu_feedbacks')) || DEFAULT_FEEDBACKS;
      const newFb = {
        id: 'fb-' + Date.now(),
        name: feedbackData.name || 'Student Learner',
        role: feedbackData.role || 'Student',
        rating: Number(feedbackData.rating) || 5,
        message: feedbackData.message,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100`,
        date: new Date().toISOString().split('T')[0]
      };
      feedbacks.unshift(newFb);
      localStorage.setItem('smartedu_feedbacks', JSON.stringify(feedbacks));
      return { message: 'Feedback submitted', feedback: newFb };
    }
  }

  async submitContact(contactData) {
    try {
      return await this.request('/api/contact', {
        method: 'POST',
        body: JSON.stringify(contactData)
      });
    } catch (e) {
      return { message: 'Inquiry received! We will reply within 24 hours.' };
    }
  }
}

const api = new ApiService();
