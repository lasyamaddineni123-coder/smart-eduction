/**
 * SMART EDUCATION SYSTEM - ONLINE COURSES & VIDEO CLASSROOM CONTROLLER
 */

class CoursesController {
  constructor() {
    this.courses = [];
    this.activeCourse = null;
    this.activeLesson = null;
    this.currentCategory = 'All';
    this.searchQuery = '';
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadCourses();
  }

  bindEvents() {
    // Filter Buttons
    const filterButtons = document.querySelectorAll('.course-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentCategory = e.currentTarget.getAttribute('data-category');
        this.renderCourses();
      });
    });

    // Search Input
    const searchInput = document.getElementById('courses-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderCourses();
      });
    }

    // Classroom Modal Close
    const closeClassroomBtn = document.getElementById('classroom-modal-close');
    if (closeClassroomBtn) {
      closeClassroomBtn.addEventListener('click', () => this.closeClassroom());
    }

    // Classroom Tab Switcher
    const tabButtons = document.querySelectorAll('.classroom-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabButtons.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.classroom-tab-content').forEach(c => c.classList.remove('active'));

        e.currentTarget.classList.add('active');
        const tabTarget = e.currentTarget.getAttribute('data-tab');
        const content = document.getElementById(`classroom-tab-${tabTarget}`);
        if (content) content.classList.add('active');
      });
    });

    // Mark Lesson Complete Button
    const markCompleteBtn = document.getElementById('btn-mark-lesson-complete');
    if (markCompleteBtn) {
      markCompleteBtn.addEventListener('click', () => this.handleMarkLessonComplete());
    }

    // Classroom Doubt Submit
    const doubtForm = document.getElementById('classroom-doubt-form');
    if (doubtForm) {
      doubtForm.addEventListener('submit', (e) => this.handlePostDoubt(e));
    }
  }

  async loadCourses() {
    try {
      this.courses = await api.getCourses();
      this.renderCourses();
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  }

  renderCourses() {
    const grid = document.getElementById('courses-grid');
    if (!grid) return;

    let filtered = this.courses;

    if (this.currentCategory && this.currentCategory !== 'All') {
      filtered = filtered.filter(c => c.category.toLowerCase() === this.currentCategory.toLowerCase());
    }

    if (this.searchQuery) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(this.searchQuery) ||
        c.description.toLowerCase().includes(this.searchQuery) ||
        c.instructor.name.toLowerCase().includes(this.searchQuery)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--purple-100); color: var(--accent-purple); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 16px;">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <h3 style="font-size: 1.3rem; margin-bottom: 6px;">No Courses Found</h3>
          <p style="color: var(--text-muted);">Try adjusting your search keyword or selecting a different subject filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(course => {
      const isEnrolled = window.authController?.currentUser?.enrolledCourses?.some(e => e.courseId === course.id);
      return `
        <div class="course-card" data-id="${course.id}">
          <div class="course-thumbnail-wrapper">
            <img src="${course.thumbnail}" alt="${course.title}" class="course-thumbnail" loading="lazy">
            <span class="course-category-tag">${course.category}</span>
            <span class="course-level-tag">${course.level}</span>
          </div>

          <div class="course-body">
            <div class="course-meta">
              <span class="course-rating">
                <i class="fa-solid fa-star"></i> ${course.rating} <span style="font-weight: 400; color: var(--text-muted);">(${course.reviewCount})</span>
              </span>
              <span><i class="fa-regular fa-clock"></i> ${course.duration}</span>
              <span><i class="fa-solid fa-play-circle"></i> ${course.totalLessons} Lessons</span>
            </div>

            <h3 class="course-title">${course.title}</h3>
            <p class="course-desc">${course.description}</p>

            <div class="course-footer">
              <div class="course-instructor">
                <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="instructor-avatar">
                <div>
                  <h5 class="instructor-name">${course.instructor.name}</h5>
                  <p class="instructor-title">${course.instructor.title.split('&')[0]}</p>
                </div>
              </div>

              <button class="btn btn-sm ${isEnrolled ? 'btn-purple' : 'btn-primary'} btn-open-classroom" onclick="coursesController.openClassroom('${course.id}')">
                <i class="fa-solid ${isEnrolled ? 'fa-play' : 'fa-graduation-cap'}"></i>
                ${isEnrolled ? 'Continue' : 'Start Learning'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  async openClassroom(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    this.activeCourse = course;
    this.activeLesson = course.syllabus[0];

    // Enroll if not already
    const currentUser = window.authController?.currentUser;
    const isEnrolled = currentUser?.enrolledCourses?.some(e => e.courseId === courseId);
    if (!isEnrolled) {
      try {
        const res = await api.enrollCourse(courseId);
        if (res.user && window.authController) {
          window.authController.currentUser = res.user;
          showToast(`Enrolled in "${course.title}"! 🎉`, 'success');
        }
      } catch (err) {
        console.warn('Enrollment API error:', err);
      }
    }

    const modal = document.getElementById('classroom-modal');
    if (!modal) return;

    // Set Header
    document.getElementById('classroom-course-title').textContent = course.title;
    document.getElementById('classroom-category-badge').textContent = course.category;

    this.renderClassroomLesson();
    this.renderClassroomPlaylist();

    modal.classList.add('active');
  }

  renderClassroomLesson() {
    if (!this.activeCourse || !this.activeLesson) return;

    const videoEl = document.getElementById('classroom-video');
    if (videoEl) {
      videoEl.src = this.activeLesson.videoUrl;
      videoEl.load();
    }

    document.getElementById('classroom-lesson-title').textContent = this.activeLesson.title;
    document.getElementById('classroom-lesson-duration').textContent = this.activeLesson.duration;
    document.getElementById('classroom-lesson-summary').textContent = this.activeLesson.summary;
    document.getElementById('classroom-lesson-notes-text').textContent = this.activeLesson.notes;
    document.getElementById('classroom-instructor-name').textContent = this.activeCourse.instructor.name;

    // Check completion status
    const enrolledData = window.authController?.currentUser?.enrolledCourses?.find(e => e.courseId === this.activeCourse.id);
    const isCompleted = enrolledData?.completedLessons?.includes(this.activeLesson.id);

    const markBtn = document.getElementById('btn-mark-lesson-complete');
    if (markBtn) {
      if (isCompleted) {
        markBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Completed';
        markBtn.classList.remove('btn-primary');
        markBtn.classList.add('btn-secondary');
        markBtn.disabled = true;
      } else {
        markBtn.innerHTML = '<i class="fa-solid fa-check"></i> Mark Lesson as Complete';
        markBtn.classList.remove('btn-secondary');
        markBtn.classList.add('btn-primary');
        markBtn.disabled = false;
      }
    }
  }

  renderClassroomPlaylist() {
    const list = document.getElementById('classroom-playlist');
    if (!list || !this.activeCourse) return;

    const enrolledData = window.authController?.currentUser?.enrolledCourses?.find(e => e.courseId === this.activeCourse.id);
    const completedList = enrolledData?.completedLessons || [];

    list.innerHTML = this.activeCourse.syllabus.map((lesson, idx) => {
      const isCurrent = lesson.id === this.activeLesson.id;
      const isCompleted = completedList.includes(lesson.id);

      return `
        <div class="playlist-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}" onclick="coursesController.switchLesson('${lesson.id}')">
          <div class="playlist-item-num">
            ${isCompleted ? '<i class="fa-solid fa-check"></i>' : idx + 1}
          </div>
          <div class="playlist-item-title">${lesson.title}</div>
          <div class="playlist-item-time">${lesson.duration}</div>
        </div>
      `;
    }).join('');
  }

  switchLesson(lessonId) {
    if (!this.activeCourse) return;
    const lesson = this.activeCourse.syllabus.find(l => l.id === lessonId);
    if (!lesson) return;

    this.activeLesson = lesson;
    this.renderClassroomLesson();
    this.renderClassroomPlaylist();
  }

  async handleMarkLessonComplete() {
    if (!this.activeCourse || !this.activeLesson) return;

    try {
      const res = await api.completeLesson(this.activeCourse.id, this.activeLesson.id);
      if (res.user && window.authController) {
        window.authController.currentUser = res.user;
        if (window.dashboardController) window.dashboardController.render(res.user);
      }

      showToast(`Lesson marked as completed! +50 XP 🌟`, 'success');
      this.renderClassroomLesson();
      this.renderClassroomPlaylist();
      this.renderCourses();
    } catch (err) {
      showToast('Completed lesson locally! ✨', 'success');
      // Local fallback
      const user = window.authController?.currentUser;
      if (user) {
        let enrolled = user.enrolledCourses?.find(e => e.courseId === this.activeCourse.id);
        if (enrolled && !enrolled.completedLessons.includes(this.activeLesson.id)) {
          enrolled.completedLessons.push(this.activeLesson.id);
          enrolled.progress = Math.min(100, Math.round((enrolled.completedLessons.length / this.activeCourse.syllabus.length) * 100));
        }
        this.renderClassroomLesson();
        this.renderClassroomPlaylist();
      }
    }
  }

  handlePostDoubt(e) {
    e.preventDefault();
    const input = document.getElementById('classroom-doubt-input');
    const val = input.value.trim();
    if (!val) return;

    const list = document.getElementById('classroom-doubts-list');
    const item = document.createElement('div');
    item.style.cssText = 'padding: 12px 14px; background: var(--bg-main); border-radius: 8px; border: 1px solid var(--border-light); margin-bottom: 10px; font-size: 0.9rem;';
    item.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
        <strong style="color: var(--primary);"><i class="fa-solid fa-user-circle"></i> You</strong>
        <span style="font-size: 0.75rem; color: var(--text-muted);">Just now</span>
      </div>
      <p style="color: var(--text-main);">${val}</p>
    `;
    list.prepend(item);
    input.value = '';
    showToast('Question posted! Instructor & AI will respond shortly.', 'info');
  }

  closeClassroom() {
    const modal = document.getElementById('classroom-modal');
    if (modal) {
      modal.classList.remove('active');
      const video = document.getElementById('classroom-video');
      if (video) video.pause();
    }
  }
}

let coursesController;
document.addEventListener('DOMContentLoaded', () => {
  coursesController = new CoursesController();
  window.coursesController = coursesController;
});

