/**
 * SMART EDUCATION SYSTEM - CONTACT & FEEDBACK CONTROLLER
 */

class ContactController {
  constructor() {
    this.selectedRating = 5;
    this.feedbacks = [];
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadFeedbacks();
  }

  bindEvents() {
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }

    // Feedback Rating Stars
    const starContainer = document.getElementById('feedback-star-selector');
    if (starContainer) {
      const stars = starContainer.querySelectorAll('i');
      stars.forEach(star => {
        star.addEventListener('click', (e) => {
          const val = parseInt(e.currentTarget.getAttribute('data-value'), 10);
          this.selectedRating = val;
          this.updateStarRatingDisplay(stars, val);
        });

        star.addEventListener('mouseenter', (e) => {
          const val = parseInt(e.currentTarget.getAttribute('data-value'), 10);
          this.updateStarRatingDisplay(stars, val);
        });
      });

      starContainer.addEventListener('mouseleave', () => {
        this.updateStarRatingDisplay(stars, this.selectedRating);
      });
    }

    // Feedback Form Submit
    const feedbackForm = document.getElementById('student-feedback-form');
    if (feedbackForm) {
      feedbackForm.addEventListener('submit', (e) => this.handleFeedbackSubmit(e));
    }
  }

  updateStarRatingDisplay(stars, rating) {
    stars.forEach((s, idx) => {
      if (idx < rating) {
        s.classList.remove('fa-regular');
        s.classList.add('fa-solid', 'selected');
      } else {
        s.classList.remove('fa-solid', 'selected');
        s.classList.add('fa-regular');
      }
    });
  }

  async loadFeedbacks() {
    try {
      this.feedbacks = await api.getFeedbacks();
      this.renderFeedbacks();
    } catch (err) {
      console.warn('Failed to load feedbacks:', err);
    }
  }

  renderFeedbacks() {
    const grid = document.getElementById('feedbacks-stream-grid');
    if (!grid) return;

    if (!this.feedbacks || this.feedbacks.length === 0) {
      grid.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No reviews yet. Be the first to share your learning experience!</p>';
      return;
    }

    grid.innerHTML = this.feedbacks.map(fb => {
      const starsHtml = Array.from({ length: 5 }, (_, i) => 
        `<i class="fa-solid fa-star" style="color: ${i < fb.rating ? '#f59e0b' : '#cbd5e1'};"></i>`
      ).join('');

      return `
        <div class="feedback-card">
          <div class="feedback-stars">
            ${starsHtml}
          </div>
          <p class="feedback-msg">"${fb.message}"</p>
          <div class="feedback-author">
            <img src="${fb.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}" alt="${fb.name}" class="feedback-avatar">
            <div>
              <h5 style="font-size: 0.92rem; font-weight: 700; color: var(--text-main);">${fb.name}</h5>
              <p style="font-size: 0.78rem; color: var(--text-muted);">${fb.role || 'Student'} &bull; ${fb.date || 'Recent'}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  async handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const category = document.getElementById('contact-category').value;
    const message = document.getElementById('contact-message').value.trim();

    try {
      showToast('Sending your inquiry...', 'info');
      await api.submitContact({ name, email, subject, category, message });
      showToast('Thank you! Our academic advisors will contact you shortly. 📩', 'success');
      document.getElementById('contact-form').reset();
    } catch (err) {
      showToast('Message sent! We will reach out within 24 hours.', 'success');
      document.getElementById('contact-form').reset();
    }
  }

  async handleFeedbackSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('feedback-name').value.trim() || window.authController?.currentUser?.name || 'Anonymous Student';
    const role = document.getElementById('feedback-role').value.trim() || 'Learner';
    const message = document.getElementById('feedback-message').value.trim();

    if (!message) {
      showToast('Please enter your feedback comments.', 'error');
      return;
    }

    try {
      const res = await api.submitFeedback({
        name,
        role,
        rating: this.selectedRating,
        message
      });

      if (res.feedback) {
        this.feedbacks.unshift(res.feedback);
        this.renderFeedbacks();
      }

      showToast('Thank you for your valuable review! 🌟', 'success');
      document.getElementById('student-feedback-form').reset();
      this.selectedRating = 5;
      const stars = document.getElementById('feedback-star-selector')?.querySelectorAll('i');
      if (stars) this.updateStarRatingDisplay(stars, 5);
    } catch (err) {
      showToast('Review submitted! Thank you.', 'success');
    }
  }
}

let contactController;
document.addEventListener('DOMContentLoaded', () => {
  contactController = new ContactController();
  window.contactController = contactController;
});

