const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = {
        users: [],
        courses: [],
        materials: [],
        exams: [],
        feedbacks: [],
        contactMessages: []
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  }

  read() {
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading database file:', err);
      return {
        users: [],
        courses: [],
        materials: [],
        exams: [],
        feedbacks: [],
        contactMessages: []
      };
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error writing to database:', err);
      return false;
    }
  }

  // Auth & Users
  getUserByEmail(email) {
    const data = this.read();
    return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    const data = this.read();
    return data.users.find(u => u.id === id);
  }

  createUser(userData) {
    const data = this.read();
    const newUser = {
      id: 'usr_' + Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'student',
      grade: userData.grade || 'Student',
      major: userData.major || 'General Studies',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      streak: 1,
      studyHours: 0,
      enrolledCourses: [],
      examResults: [],
      badges: [
        {
          id: 'b-welcome',
          title: 'Smart Explorer',
          icon: 'fa-compass',
          desc: 'Created an account in Smart Education System'
        }
      ]
    };
    data.users.push(newUser);
    this.write(data);
    return newUser;
  }

  updateUser(id, updates) {
    const data = this.read();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    data.users[idx] = { ...data.users[idx], ...updates };
    this.write(data);
    return data.users[idx];
  }

  // Course Enrollment & Progress
  enrollCourse(userId, courseId) {
    const data = this.read();
    const user = data.users.find(u => u.id === userId);
    if (!user) return null;

    if (!user.enrolledCourses) user.enrolledCourses = [];
    const existing = user.enrolledCourses.find(c => c.courseId === courseId);
    if (!existing) {
      user.enrolledCourses.push({
        courseId,
        enrolledAt: new Date().toISOString().split('T')[0],
        completedLessons: [],
        progress: 0,
        lastAccessed: new Date().toISOString().split('T')[0]
      });
      this.write(data);
    }
    return user;
  }

  completeLesson(userId, courseId, lessonId) {
    const data = this.read();
    const user = data.users.find(u => u.id === userId);
    if (!user) return null;

    const enrolled = user.enrolledCourses.find(c => c.courseId === courseId);
    if (!enrolled) {
      // Auto enroll if not yet enrolled
      user.enrolledCourses.push({
        courseId,
        enrolledAt: new Date().toISOString().split('T')[0],
        completedLessons: [lessonId],
        progress: 20,
        lastAccessed: new Date().toISOString().split('T')[0]
      });
    } else {
      if (!enrolled.completedLessons.includes(lessonId)) {
        enrolled.completedLessons.push(lessonId);
      }
      const course = data.courses.find(c => c.id === courseId);
      const totalLessons = course ? course.syllabus.length : 5;
      enrolled.progress = Math.min(100, Math.round((enrolled.completedLessons.length / totalLessons) * 100));
      enrolled.lastAccessed = new Date().toISOString().split('T')[0];
    }

    user.studyHours = Math.round((user.studyHours + 0.5) * 10) / 10;
    this.write(data);
    return user;
  }

  // Exam Submissions
  recordExamResult(userId, examResult) {
    const data = this.read();
    const user = data.users.find(u => u.id === userId);
    if (!user) return null;

    if (!user.examResults) user.examResults = [];
    user.examResults.unshift({
      ...examResult,
      date: new Date().toISOString().split('T')[0]
    });

    if (examResult.score >= 80) {
      const hasBadge = user.badges.some(b => b.id === 'b-high-scorer');
      if (!hasBadge) {
        user.badges.push({
          id: 'b-high-scorer',
          title: 'High Achiever',
          icon: 'fa-award',
          desc: 'Achieved 80%+ on an official exam'
        });
      }
    }

    this.write(data);
    return user;
  }

  // Courses
  getCourses() {
    return this.read().courses;
  }

  getCourseById(id) {
    return this.read().courses.find(c => c.id === id);
  }

  // Study Materials
  getMaterials() {
    return this.read().materials;
  }

  getMaterialById(id) {
    return this.read().materials.find(m => m.id === id);
  }

  // Exams
  getExams() {
    return this.read().exams;
  }

  getExamById(id) {
    return this.read().exams.find(e => e.id === id);
  }

  // Feedback & Contact
  getFeedbacks() {
    return this.read().feedbacks;
  }

  addFeedback(feedback) {
    const data = this.read();
    const newFeedback = {
      id: 'fb-' + Date.now(),
      name: feedback.name || 'Anonymous Learner',
      role: feedback.role || 'Student',
      rating: Number(feedback.rating) || 5,
      message: feedback.message,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(feedback.name || 'Student')}`,
      date: new Date().toISOString().split('T')[0]
    };
    data.feedbacks.unshift(newFeedback);
    this.write(data);
    return newFeedback;
  }

  addContactMessage(msg) {
    const data = this.read();
    const newMsg = {
      id: 'msg-' + Date.now(),
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      category: msg.category || 'General Inquiry',
      createdAt: new Date().toISOString()
    };
    if (!data.contactMessages) data.contactMessages = [];
    data.contactMessages.push(newMsg);
    this.write(data);
    return newMsg;
  }
}

module.exports = new Database();

