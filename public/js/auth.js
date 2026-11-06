/**
 * SMART EDUCATION SYSTEM - AUTHENTICATION & PROFILE CONTROLLER
 */

class AuthController {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadCurrentUser();
  }

  bindEvents() {
    // Open Auth Modal
    const authBtn = document.getElementById('nav-auth-btn');
    if (authBtn) {
      authBtn.addEventListener('click', () => this.openAuthModal('login'));
    }

    // Modal close buttons
    const closeBtn = document.getElementById('auth-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeAuthModal());
    }

    // Tab switching in modal
    const loginTabBtn = document.getElementById('tab-btn-login');
    const registerTabBtn = document.getElementById('tab-btn-register');
    if (loginTabBtn && registerTabBtn) {
      loginTabBtn.addEventListener('click', () => this.switchAuthTab('login'));
      registerTabBtn.addEventListener('click', () => this.switchAuthTab('register'));
    }

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Register Form Submit
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Quick Demo Student Login Button
    const demoLoginBtn = document.getElementById('demo-login-btn');
    if (demoLoginBtn) {
      demoLoginBtn.addEventListener('click', () => this.handleDemoLogin());
    }

    // Profile Edit Modal
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => this.openProfileModal());
    }

    const profileModalClose = document.getElementById('profile-modal-close');
    if (profileModalClose) {
      profileModalClose.addEventListener('click', () => this.closeProfileModal());
    }

    const profileForm = document.getElementById('profile-edit-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }
  }

  async loadCurrentUser() {
    try {
      const data = await api.getCurrentUser();
      if (data && data.user) {
        this.currentUser = data.user;
        this.updateNavUI();
        if (window.dashboardController) {
          window.dashboardController.render(this.currentUser);
        }
      }
    } catch (err) {
      // Default to demo student if offline or error
      this.currentUser = {
        id: 'usr_demo',
        name: 'Alex Johnson',
        email: 'alex.student@smartedu.com',
        role: 'student',
        grade: 'Undergraduate - 2nd Year',
        major: 'Computer Science & AI',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        streak: 7,
        studyHours: 42.5,
        enrolledCourses: [
          { courseId: 'course-1', completedLessons: ['c1-l1', 'c1-l2', 'c1-l3'], progress: 60 },
          { courseId: 'course-2', completedLessons: ['c2-l1', 'c2-l2'], progress: 40 },
          { courseId: 'course-4', completedLessons: ['c4-l1', 'c4-l2', 'c4-l3', 'c4-l4'], progress: 100 }
        ],
        examResults: [
          { examTitle: 'Python Programming Mastery', score: 90, grade: 'A+', status: 'Passed', date: '2026-11-02' }
        ],
        badges: [
          { id: 'b1', title: 'Fast Starter', icon: 'fa-bolt', desc: 'Enrolled in 3 courses' },
          { id: 'b2', title: 'Quiz Champion', icon: 'fa-trophy', desc: 'Scored 90%+ in exam' }
        ]
      };
      this.updateNavUI();
    }
  }

  updateNavUI() {
    const authBtn = document.getElementById('nav-auth-btn');
    const userDropdown = document.getElementById('nav-user-dropdown');
    const navUserName = document.getElementById('nav-user-name');
    const navUserAvatar = document.getElementById('nav-user-avatar');

    if (this.currentUser) {
      if (authBtn) authBtn.style.display = 'none';
      if (userDropdown) userDropdown.style.display = 'flex';
      if (navUserName) navUserName.textContent = this.currentUser.name.split(' ')[0];
      if (navUserAvatar) navUserAvatar.src = this.currentUser.avatar;
    } else {
      if (authBtn) authBtn.style.display = 'inline-flex';
      if (userDropdown) userDropdown.style.display = 'none';
    }
  }

  openAuthModal(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('active');
      this.switchAuthTab(tab);
    }
  }

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
  }

  switchAuthTab(tab) {
    const loginTabBtn = document.getElementById('tab-btn-login');
    const registerTabBtn = document.getElementById('tab-btn-register');
    const loginSection = document.getElementById('auth-section-login');
    const registerSection = document.getElementById('auth-section-register');

    if (tab === 'login') {
      loginTabBtn.classList.add('active');
      registerTabBtn.classList.remove('active');
      loginSection.style.display = 'block';
      registerSection.style.display = 'none';
    } else {
      registerTabBtn.classList.add('active');
      loginTabBtn.classList.remove('active');
      registerSection.style.display = 'block';
      loginSection.style.display = 'none';
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const res = await api.login(email, password);
      this.currentUser = res.user;
      api.setUserId(this.currentUser.id);
      this.updateNavUI();
      this.closeAuthModal();
      showToast(`Welcome back, ${this.currentUser.name}! 👋`, 'success');
      if (window.dashboardController) window.dashboardController.render(this.currentUser);
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    }
  }

  async handleDemoLogin() {
    try {
      const res = await api.login('alex.student@smartedu.com', 'password123');
      this.currentUser = res.user;
      api.setUserId(this.currentUser.id);
      this.updateNavUI();
      this.closeAuthModal();
      showToast(`Logged in as Demo Student: Alex Johnson! 🚀`, 'success');
      if (window.dashboardController) window.dashboardController.render(this.currentUser);
    } catch (err) {
      // Offline fallback
      this.currentUser = {
        id: 'usr_demo',
        name: 'Alex Johnson',
        email: 'alex.student@smartedu.com',
        role: 'student',
        grade: 'Undergraduate - 2nd Year',
        major: 'Computer Science & AI',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        streak: 7,
        studyHours: 42.5
      };
      this.updateNavUI();
      this.closeAuthModal();
      showToast('Logged in as Demo Student! 🚀', 'success');
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const grade = document.getElementById('register-grade').value;
    const major = document.getElementById('register-major').value.trim();

    try {
      const res = await api.register({ name, email, password, grade, major });
      this.currentUser = res.user;
      api.setUserId(this.currentUser.id);
      this.updateNavUI();
      this.closeAuthModal();
      showToast(`Welcome to Smart Education, ${this.currentUser.name}! 🎓`, 'success');
      if (window.dashboardController) window.dashboardController.render(this.currentUser);
    } catch (err) {
      showToast(err.message || 'Registration failed. Try again.', 'error');
    }
  }

  openProfileModal() {
    if (!this.currentUser) return;
    const modal = document.getElementById('profile-modal');
    if (!modal) return;

    document.getElementById('edit-profile-name').value = this.currentUser.name || '';
    document.getElementById('edit-profile-grade').value = this.currentUser.grade || '';
    document.getElementById('edit-profile-major').value = this.currentUser.major || '';

    modal.classList.add('active');
  }

  closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) modal.classList.remove('active');
  }

  async handleProfileUpdate(e) {
    e.preventDefault();
    if (!this.currentUser) return;

    const updates = {
      name: document.getElementById('edit-profile-name').value.trim(),
      grade: document.getElementById('edit-profile-grade').value.trim(),
      major: document.getElementById('edit-profile-major').value.trim()
    };

    try {
      const res = await api.updateProfile(updates);
      this.currentUser = res.user;
      this.updateNavUI();
      this.closeProfileModal();
      showToast('Profile updated successfully! ✨', 'success');
      if (window.dashboardController) window.dashboardController.render(this.currentUser);
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    }
  }

  handleLogout() {
    this.currentUser = null;
    api.setUserId(null);
    this.updateNavUI();
    showToast('You have been logged out.', 'info');
    navigateTo('home');
  }
}

let authController;
document.addEventListener('DOMContentLoaded', () => {
  authController = new AuthController();
  window.authController = authController;
});

