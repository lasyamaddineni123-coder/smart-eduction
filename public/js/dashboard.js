/**
 * SMART EDUCATION SYSTEM - STUDENT DASHBOARD CONTROLLER
 */

class DashboardController {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Goal Checkboxes toggle
    document.querySelectorAll('.dash-goal-checkbox').forEach(box => {
      box.addEventListener('change', (e) => {
        const item = e.target.closest('.goal-item');
        if (item) {
          if (e.target.checked) {
            item.style.opacity = '0.6';
            item.style.textDecoration = 'line-through';
            showToast('Goal completed! Keep going! 🎯', 'success');
          } else {
            item.style.opacity = '1';
            item.style.textDecoration = 'none';
          }
        }
      });
    });
  }

  render(user) {
    if (!user) return;

    // Profile Banner
    const nameEl = document.getElementById('dash-user-name');
    const avatarEl = document.getElementById('dash-user-avatar');
    const roleEl = document.getElementById('dash-user-role');
    const streakEl = document.getElementById('dash-user-streak');
    const hoursEl = document.getElementById('dash-user-hours');

    if (nameEl) nameEl.textContent = user.name;
    if (avatarEl) avatarEl.src = user.avatar;
    if (roleEl) roleEl.textContent = `${user.grade} • ${user.major || 'Computer Science'}`;
    if (streakEl) streakEl.textContent = `${user.streak || 7} Days 🔥`;
    if (hoursEl) hoursEl.textContent = `${user.studyHours || 42.5} hrs`;

    // Metrics
    const enrolledCourses = user.enrolledCourses || [];
    const totalEnrolled = enrolledCourses.length;
    let completedLessonsCount = 0;
    enrolledCourses.forEach(c => {
      completedLessonsCount += (c.completedLessons || []).length;
    });

    const examResults = user.examResults || [];
    let avgScore = 0;
    if (examResults.length > 0) {
      const sum = examResults.reduce((acc, curr) => acc + (curr.score || 0), 0);
      avgScore = Math.round(sum / examResults.length);
    }

    const metricEnrolled = document.getElementById('metric-courses-enrolled');
    const metricLessons = document.getElementById('metric-lessons-completed');
    const metricScore = document.getElementById('metric-avg-score');
    const metricHours = document.getElementById('metric-total-hours');

    if (metricEnrolled) metricEnrolled.textContent = totalEnrolled;
    if (metricLessons) metricLessons.textContent = completedLessonsCount;
    if (metricScore) metricScore.textContent = examResults.length > 0 ? `${avgScore}%` : 'N/A';
    if (metricHours) metricHours.textContent = `${user.studyHours || 42.5}h`;

    // Render Enrolled Courses
    this.renderEnrolledCourses(enrolledCourses);

    // Render Recent Exam Results Table
    this.renderExamResultsTable(examResults);

    // Render Badges
    this.renderBadges(user.badges || []);
  }

  renderEnrolledCourses(enrolledCourses) {
    const container = document.getElementById('dash-enrolled-courses-list');
    if (!container) return;

    if (enrolledCourses.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <p>You haven't enrolled in any courses yet.</p>
          <button class="btn btn-sm btn-primary" style="margin-top: 10px;" onclick="navigateTo('courses')">Explore Courses</button>
        </div>
      `;
      return;
    }

    const allCourses = window.coursesController?.courses || [];

    container.innerHTML = enrolledCourses.map(item => {
      const course = allCourses.find(c => c.id === item.courseId);
      const title = course ? course.title : 'Full-Stack Web Development';
      const thumbnail = course ? course.thumbnail : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200';
      const progress = item.progress || 0;

      return `
        <div class="enrolled-course-item">
          <img src="${thumbnail}" alt="${title}" class="enrolled-thumb">
          <div class="enrolled-content">
            <h4>${title}</h4>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${progress}%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="progress-label">${progress}% Completed</span>
              <button class="btn btn-sm btn-purple" style="padding: 4px 10px; font-size: 0.78rem;" onclick="coursesController.openClassroom('${item.courseId}')">
                <i class="fa-solid fa-play"></i> Continue
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderExamResultsTable(results) {
    const tbody = document.getElementById('dash-exam-results-tbody');
    if (!tbody) return;

    if (results.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 24px; color: var(--text-muted);">
            No exams taken yet. <a href="#exams" onclick="navigateTo('exams')">Take a Practice Exam</a>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = results.map(res => `
      <tr>
        <td style="font-weight: 600;">${res.examTitle}</td>
        <td>${res.date || 'Recent'}</td>
        <td style="font-weight: 700; color: var(--primary);">${res.score}%</td>
        <td><span class="badge ${res.status === 'Passed' ? 'badge-success' : 'badge-warning'}">${res.grade || 'A'} (${res.status || 'Passed'})</span></td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="navigateTo('exams')">
            <i class="fa-solid fa-rotate-right"></i> Retake
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderBadges(badges) {
    const container = document.getElementById('dash-badges-container');
    if (!container) return;

    container.innerHTML = badges.map(b => `
      <div class="badge-item-card">
        <div class="badge-icon-circle">
          <i class="fa-solid ${b.icon || 'fa-award'}"></i>
        </div>
        <h5>${b.title}</h5>
        <p>${b.desc}</p>
      </div>
    `).join('');
  }
}

let dashboardController;
document.addEventListener('DOMContentLoaded', () => {
  dashboardController = new DashboardController();
  window.dashboardController = dashboardController;
});

