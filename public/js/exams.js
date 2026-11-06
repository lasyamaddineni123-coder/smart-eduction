/**
 * SMART EDUCATION SYSTEM - ONLINE EXAMINATION & MCQ ENGINE
 */

class ExamsController {
  constructor() {
    this.exams = [];
    this.currentExam = null;
    this.currentQuestionIndex = 0;
    this.userAnswers = {}; // { qId: optionIndex }
    this.flaggedQuestions = new Set();
    this.timerInterval = null;
    this.secondsRemaining = 0;
    this.totalSeconds = 0;
    this.examStartTime = null;
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadExams();
  }

  bindEvents() {
    // Nav controls inside live exam
    const nextBtn = document.getElementById('exam-btn-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
    }

    const prevBtn = document.getElementById('exam-btn-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevQuestion());
    }

    const flagBtn = document.getElementById('exam-btn-flag');
    if (flagBtn) {
      flagBtn.addEventListener('click', () => this.toggleFlagQuestion());
    }

    const submitBtn = document.getElementById('exam-btn-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.confirmSubmitExam());
    }

    // Modal Close buttons
    const examModalClose = document.getElementById('exam-modal-close');
    if (examModalClose) {
      examModalClose.addEventListener('click', () => this.closeExamModal());
    }

    const resultModalClose = document.getElementById('result-modal-close');
    if (resultModalClose) {
      resultModalClose.addEventListener('click', () => this.closeResultModal());
    }

    // Download Certificate
    const certBtn = document.getElementById('btn-download-certificate');
    if (certBtn) {
      certBtn.addEventListener('click', () => this.downloadCertificate());
    }

    // Retake Exam
    const retakeBtn = document.getElementById('btn-retake-exam');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        this.closeResultModal();
        if (this.currentExam) this.startExam(this.currentExam.id);
      });
    }
  }

  async loadExams() {
    try {
      this.exams = await api.getExams();
      this.renderExamsCatalog();
    } catch (err) {
      console.error('Failed to load exams:', err);
    }
  }

  renderExamsCatalog() {
    const grid = document.getElementById('exams-catalog-grid');
    if (!grid) return;

    grid.innerHTML = this.exams.map(exam => `
      <div class="exam-catalog-card">
        <div class="exam-badge-row">
          <span class="badge badge-purple">${exam.category}</span>
          <span class="badge badge-primary"><i class="fa-regular fa-clock"></i> ${exam.durationMinutes} Mins</span>
        </div>

        <h3 class="exam-title">${exam.title}</h3>
        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 12px;">${exam.description}</p>

        <ul class="exam-details-list">
          <li><i class="fa-solid fa-list-check"></i> ${exam.totalQuestions || 10} Multiple Choice Questions</li>
          <li><i class="fa-solid fa-award"></i> Total Marks: ${exam.totalMarks} (Passing: ${exam.passingMarks}%)</li>
          <li><i class="fa-solid fa-bolt"></i> Instant Result & Certificate Generated</li>
        </ul>

        <button class="btn btn-purple" style="width: 100%; margin-top: auto;" onclick="examsController.startExam('${exam.id}')">
          <i class="fa-solid fa-pen-to-square"></i> Start Practice Exam
        </button>
      </div>
    `).join('');
  }

  async startExam(examId) {
    try {
      showToast('Loading exam questions...', 'info');
      const exam = await api.getExamById(examId);
      if (!exam || !exam.questions || exam.questions.length === 0) {
        showToast('Exam questions not found.', 'error');
        return;
      }

      this.currentExam = exam;
      this.currentQuestionIndex = 0;
      this.userAnswers = {};
      this.flaggedQuestions.clear();
      this.secondsRemaining = (exam.durationMinutes || 10) * 60;
      this.totalSeconds = this.secondsRemaining;
      this.examStartTime = new Date();

      const modal = document.getElementById('exam-modal');
      if (modal) {
        document.getElementById('live-exam-title').textContent = exam.title;
        modal.classList.add('active');
        this.renderQuestion();
        this.renderPalette();
        this.startTimer();
      }
    } catch (err) {
      showToast('Could not start exam. Please try again.', 'error');
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.secondsRemaining--;
      this.updateTimerDisplay();

      if (this.secondsRemaining <= 0) {
        clearInterval(this.timerInterval);
        showToast('Time is up! Submitting your answers automatically.', 'warning');
        this.submitExam();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const clockEl = document.getElementById('exam-timer-clock');
    if (!clockEl) return;

    const mins = Math.floor(this.secondsRemaining / 60);
    const secs = this.secondsRemaining % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatted}`;

    if (this.secondsRemaining < 60) {
      clockEl.style.color = 'var(--danger)';
    } else {
      clockEl.style.color = 'var(--accent-purple)';
    }
  }

  renderQuestion() {
    if (!this.currentExam) return;
    const q = this.currentExam.questions[this.currentQuestionIndex];
    if (!q) return;

    document.getElementById('exam-question-number').textContent = `Question ${this.currentQuestionIndex + 1} of ${this.currentExam.questions.length}`;
    document.getElementById('exam-question-text').textContent = q.question;

    const optionsContainer = document.getElementById('exam-options-container');
    const selectedIndex = this.userAnswers[q.id];

    optionsContainer.innerHTML = q.options.map((opt, idx) => `
      <div class="exam-option-item ${selectedIndex === idx ? 'selected' : ''}" onclick="examsController.selectOption('${q.id}', ${idx})">
        <div class="exam-opt-indicator">
          ${selectedIndex === idx ? '<i class="fa-solid fa-check" style="font-size: 0.75rem;"></i>' : String.fromCharCode(65 + idx)}
        </div>
        <div class="exam-opt-text">${opt}</div>
      </div>
    `).join('');

    // Update Next/Prev state
    const prevBtn = document.getElementById('exam-btn-prev');
    const nextBtn = document.getElementById('exam-btn-next');
    if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;
    if (nextBtn) {
      if (this.currentQuestionIndex === this.currentExam.questions.length - 1) {
        nextBtn.innerHTML = 'Review <i class="fa-solid fa-arrow-right"></i>';
      } else {
        nextBtn.innerHTML = 'Next <i class="fa-solid fa-arrow-right"></i>';
      }
    }

    // Update flag icon
    const flagBtn = document.getElementById('exam-btn-flag');
    if (flagBtn) {
      const isFlagged = this.flaggedQuestions.has(q.id);
      flagBtn.innerHTML = isFlagged ? '<i class="fa-solid fa-flag" style="color: var(--warning);"></i> Unflag' : '<i class="fa-regular fa-flag"></i> Flag';
    }

    this.renderPalette();
  }

  selectOption(qId, optionIndex) {
    this.userAnswers[qId] = optionIndex;
    this.renderQuestion();
    this.renderPalette();
  }

  toggleFlagQuestion() {
    const q = this.currentExam.questions[this.currentQuestionIndex];
    if (!q) return;

    if (this.flaggedQuestions.has(q.id)) {
      this.flaggedQuestions.delete(q.id);
    } else {
      this.flaggedQuestions.add(q.id);
    }
    this.renderQuestion();
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.currentExam.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderQuestion();
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.renderQuestion();
    }
  }

  jumpToQuestion(idx) {
    this.currentQuestionIndex = idx;
    this.renderQuestion();
  }

  renderPalette() {
    const palette = document.getElementById('exam-palette-grid');
    if (!palette || !this.currentExam) return;

    palette.innerHTML = this.currentExam.questions.map((q, idx) => {
      const isCurrent = idx === this.currentQuestionIndex;
      const isAnswered = this.userAnswers[q.id] !== undefined;
      const isFlagged = this.flaggedQuestions.has(q.id);

      let classes = 'palette-btn';
      if (isCurrent) classes += ' current';
      if (isAnswered) classes += ' answered';
      if (isFlagged) classes += ' flagged';

      return `
        <button class="${classes}" onclick="examsController.jumpToQuestion(${idx})">
          ${idx + 1}
        </button>
      `;
    }).join('');
  }

  confirmSubmitExam() {
    const answeredCount = Object.keys(this.userAnswers).length;
    const total = this.currentExam.questions.length;

    if (confirm(`You have answered ${answeredCount} of ${total} questions. Are you ready to submit your exam for automatic evaluation?`)) {
      this.submitExam();
    }
  }

  async submitExam() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const timeSpentSeconds = this.totalSeconds - this.secondsRemaining;
    const spentMins = Math.floor(timeSpentSeconds / 60);
    const spentSecs = timeSpentSeconds % 60;
    const timeSpentStr = `${String(spentMins).padStart(2, '0')}:${String(spentSecs).padStart(2, '0')}`;

    try {
      showToast('Grading exam & calculating score...', 'info');
      const response = await api.submitExam(this.currentExam.id, this.userAnswers, timeSpentStr);
      
      this.closeExamModal();
      this.displayResults(response.result, response.breakdown);

      if (response.user && window.authController) {
        window.authController.currentUser.examResults = response.user.examResults;
        window.authController.currentUser.badges = response.user.badges;
        if (window.dashboardController) window.dashboardController.render(window.authController.currentUser);
      }
    } catch (err) {
      showToast('Error submitting exam.', 'error');
    }
  }

  displayResults(result, breakdown) {
    this.lastResult = result;
    const modal = document.getElementById('exam-result-modal');
    if (!modal) return;

    document.getElementById('result-exam-title').textContent = result.examTitle;
    document.getElementById('result-score-percent').textContent = `${result.score}%`;
    document.getElementById('result-grade-tag').textContent = `Grade: ${result.grade} (${result.status})`;
    document.getElementById('result-correct-count').textContent = `${result.correctAnswers} / ${result.totalQuestions}`;
    document.getElementById('result-time-spent').textContent = result.timeSpent;

    // Confetti celebration if passed
    if (result.status === 'Passed' && window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Render detailed question review
    const reviewList = document.getElementById('result-review-list');
    if (reviewList && breakdown) {
      reviewList.innerHTML = breakdown.map((item, idx) => `
        <div class="review-q-item ${item.isCorrect ? 'correct' : 'incorrect'}">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <strong style="color: ${item.isCorrect ? 'var(--success)' : 'var(--danger)'};">
              <i class="fa-solid ${item.isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
              Question ${idx + 1}
            </strong>
            <span class="badge ${item.isCorrect ? 'badge-success' : 'badge-warning'}">
              ${item.isCorrect ? '+10 Marks' : '0 Marks'}
            </span>
          </div>
          <p style="font-weight: 600; color: var(--text-main); margin-bottom: 8px;">${item.question}</p>
          <div style="font-size: 0.88rem; margin-bottom: 4px;">
            <span style="color: var(--text-muted);">Your Choice:</span>
            <strong>${item.studentAnswerIndex !== undefined ? item.options[item.studentAnswerIndex] : 'Not Answered'}</strong>
          </div>
          <div style="font-size: 0.88rem; color: var(--success); margin-bottom: 6px;">
            <span>Correct Answer:</span>
            <strong>${item.options[item.correctIndex]}</strong>
          </div>
          <div class="review-explanation">
            <strong>Explanation:</strong> ${item.explanation}
          </div>
        </div>
      `).join('');
    }

    modal.classList.add('active');
  }

  downloadCertificate() {
    if (!this.lastResult) return;
    const studentName = window.authController?.currentUser?.name || 'Smart Student';
    const testTitle = this.lastResult.examTitle;
    const score = this.lastResult.score;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    showToast('Generating official Certificate of Achievement... 🏆', 'info');

    // Create Canvas Certificate
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 850);

    // Border Frame
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#2563eb';
    ctx.strokeRect(30, 30, 1140, 790);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#7c3aed';
    ctx.strokeRect(45, 45, 1110, 760);

    // Decorative corner gradients
    ctx.fillStyle = '#eff6ff';
    ctx.fillRect(48, 48, 1104, 80);

    // Header Title
    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SMART EDUCATION SYSTEM', 600, 100);

    ctx.fillStyle = '#7c3aed';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CERTIFICATE OF ACADEMIC ACHIEVEMENT', 600, 180);

    ctx.fillStyle = '#64748b';
    ctx.font = '18px "Inter", sans-serif';
    ctx.fillText('This certifies that', 600, 240);

    // Student Name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 46px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(studentName, 600, 310);

    // Underline
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 330);
    ctx.lineTo(850, 330);
    ctx.stroke();

    // Body text
    ctx.fillStyle = '#475569';
    ctx.font = '20px "Inter", sans-serif';
    ctx.fillText(`has successfully passed the comprehensive examination in`, 600, 390);

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(testTitle, 600, 445);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`with an Outstanding Score of ${score}% (Grade: ${this.lastResult.grade})`, 600, 500);

    // Date and Signatures
    ctx.fillStyle = '#64748b';
    ctx.font = '16px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Date: ${dateStr}`, 140, 680);
    ctx.fillText(`Verification ID: EDU-CERT-${Date.now().toString(36).toUpperCase()}`, 140, 710);

    ctx.textAlign = 'right';
    ctx.fillText('Academic Dean: Prof. David Miller', 1060, 680);
    ctx.fillText('Smart Education System Board', 1060, 710);

    // Seal icon
    ctx.beginPath();
    ctx.arc(600, 650, 48, 0, Math.PI * 2);
    ctx.fillStyle = '#7c3aed';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VERIFIED', 600, 646);
    ctx.fillText('PASS', 600, 664);

    // Download image
    const link = document.createElement('a');
    link.download = `Certificate_${studentName.replace(/\s+/g, '_')}_${testTitle.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Certificate saved to your downloads! 🏆', 'success');
  }

  closeExamModal() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const modal = document.getElementById('exam-modal');
    if (modal) modal.classList.remove('active');
  }

  closeResultModal() {
    const modal = document.getElementById('exam-result-modal');
    if (modal) modal.classList.remove('active');
  }
}

let examsController;
document.addEventListener('DOMContentLoaded', () => {
  examsController = new ExamsController();
  window.examsController = examsController;
});

