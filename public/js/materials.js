/**
 * SMART EDUCATION SYSTEM - STUDY MATERIALS & PDF GENERATOR
 */

class MaterialsController {
  constructor() {
    this.materials = [];
    this.currentType = 'All';
    this.currentSubject = 'All';
    this.searchQuery = '';
    this.activeMaterial = null;
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadMaterials();
  }

  bindEvents() {
    // Type Filter Tabs
    const typeFilters = document.querySelectorAll('.material-type-btn');
    typeFilters.forEach(btn => {
      btn.addEventListener('click', (e) => {
        typeFilters.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentType = e.currentTarget.getAttribute('data-type');
        this.renderMaterials();
      });
    });

    // Subject Filter Dropdown / Buttons
    const subjectSelect = document.getElementById('materials-subject-select');
    if (subjectSelect) {
      subjectSelect.addEventListener('change', (e) => {
        this.currentSubject = e.target.value;
        this.renderMaterials();
      });
    }

    // Search Input
    const searchInput = document.getElementById('materials-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderMaterials();
      });
    }

    // Preview Modal Close
    const closePreviewBtn = document.getElementById('material-preview-close');
    if (closePreviewBtn) {
      closePreviewBtn.addEventListener('click', () => this.closePreviewModal());
    }

    // Modal Download Button
    const modalDownloadBtn = document.getElementById('modal-download-btn');
    if (modalDownloadBtn) {
      modalDownloadBtn.addEventListener('click', () => {
        if (this.activeMaterial) this.downloadPdf(this.activeMaterial.id);
      });
    }
  }

  async loadMaterials() {
    try {
      this.materials = await api.getMaterials();
      this.renderMaterials();
      this.renderImportantQA();
    } catch (err) {
      console.error('Failed to load materials:', err);
    }
  }

  renderMaterials() {
    const grid = document.getElementById('materials-grid');
    if (!grid) return;

    let filtered = this.materials;

    if (this.currentType && this.currentType !== 'All') {
      filtered = filtered.filter(m => m.type.toLowerCase() === this.currentType.toLowerCase());
    }

    if (this.currentSubject && this.currentSubject !== 'All') {
      filtered = filtered.filter(m => m.subject.toLowerCase() === this.currentSubject.toLowerCase());
    }

    if (this.searchQuery) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(this.searchQuery) ||
        m.description.toLowerCase().includes(this.searchQuery)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px;">
          <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 12px;"></i>
          <h3 style="font-size: 1.25rem;">No Study Materials Found</h3>
          <p style="color: var(--text-muted);">Try resetting your subject or material type filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(mat => {
      let icon = 'fa-file-pdf';
      if (mat.type === 'Previous Papers') icon = 'fa-file-lines';
      if (mat.type === 'Important Q&A') icon = 'fa-circle-question';

      return `
        <div class="material-card" data-id="${mat.id}">
          <div class="material-card-top">
            <div class="material-type-icon">
              <i class="fa-solid ${icon}"></i>
            </div>
            <div class="material-meta-tags">
              <span class="badge badge-purple">${mat.subject}</span>
              <span class="badge badge-primary">${mat.type}</span>
            </div>
          </div>

          <h3 class="material-title">${mat.title}</h3>
          <p class="material-desc">${mat.description}</p>

          <div class="material-footer">
            <span class="material-size-info">
              <i class="fa-regular fa-file"></i> ${mat.pages} Pages &bull; ${mat.fileSize}
            </span>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm btn-secondary" onclick="materialsController.previewMaterial('${mat.id}')" title="Preview Note">
                <i class="fa-regular fa-eye"></i> Read
              </button>
              <button class="btn btn-sm btn-purple" onclick="materialsController.downloadPdf('${mat.id}')" title="Download Printable PDF">
                <i class="fa-solid fa-download"></i> PDF
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderImportantQA() {
    const container = document.getElementById('important-qa-accordion');
    if (!container) return;

    const qaList = [
      {
        question: "What is Time Complexity & Big-O Notation?",
        subject: "Computer Science",
        answer: "Big-O notation describes the upper bound limiting behavior of a function when arguments tend towards a particular value or infinity. Common complexities: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n^2) quadratic."
      },
      {
        question: "State and explain the Fundamental Theorem of Calculus.",
        subject: "Mathematics",
        answer: "The Fundamental Theorem links differentiation and integration. Part 1: If f is continuous on [a, b], then F(x) = integral from a to x of f(t) dt has derivative F'(x) = f(x). Part 2: The definite integral from a to b of f(x) dx = F(b) - F(a), where F is an antiderivative of f."
      },
      {
        question: "Explain the Heisenberg Uncertainty Principle in Quantum Mechanics.",
        subject: "Physics",
        answer: "Formulated by Werner Heisenberg in 1927, it states that we cannot simultaneously measure both the exact position (x) and momentum (p) of a subatomic particle: Delta(x) * Delta(p) >= h-bar / 2. This is a fundamental wave-like quantum property, not an experimental measurement flaw."
      },
      {
        question: "What is the difference between Supervised and Unsupervised Learning?",
        subject: "Artificial Intelligence",
        answer: "Supervised learning trains models on labeled datasets with ground truth target outcomes (e.g., predicting house prices with regression or spam emails with classification). Unsupervised learning identifies hidden patterns in unlabeled data (e.g., customer segmentation with K-Means clustering)."
      }
    ];

    container.innerHTML = qaList.map((qa, idx) => `
      <div class="qa-card" id="qa-item-${idx}">
        <div class="qa-header" onclick="materialsController.toggleQA(${idx})">
          <h4>
            <span class="badge badge-purple" style="font-size: 0.7rem;">${qa.subject}</span>
            ${qa.question}
          </h4>
          <i class="fa-solid fa-chevron-down chevron-icon"></i>
        </div>
        <div class="qa-body">
          <p>${qa.answer}</p>
        </div>
      </div>
    `).join('');
  }

  toggleQA(idx) {
    const card = document.getElementById(`qa-item-${idx}`);
    if (card) {
      card.classList.toggle('open');
    }
  }

  previewMaterial(id) {
    const mat = this.materials.find(m => m.id === id);
    if (!mat) return;

    this.activeMaterial = mat;
    const modal = document.getElementById('material-preview-modal');
    if (!modal) return;

    document.getElementById('preview-modal-title').textContent = mat.title;
    document.getElementById('preview-modal-subject').textContent = mat.subject;
    document.getElementById('preview-modal-type').textContent = mat.type;

    const body = document.getElementById('preview-modal-content');
    body.innerHTML = `
      <div style="background: var(--bg-main); padding: 20px; border-radius: 8px; border: 1px solid var(--border-light); font-family: monospace; white-space: pre-wrap; font-size: 0.92rem; line-height: 1.6; color: var(--text-main);">
${mat.content || mat.description}
      </div>
    `;

    modal.classList.add('active');
  }

  closePreviewModal() {
    const modal = document.getElementById('material-preview-modal');
    if (modal) modal.classList.remove('active');
  }

  downloadPdf(id) {
    const mat = this.materials.find(m => m.id === id);
    if (!mat) return;

    showToast(`Generating PDF: ${mat.title}... 📄`, 'info');

    try {
      // Use jsPDF if available
      if (window.jspdf && window.jspdf.jsPDF) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Header Decoration
        doc.setFillColor(37, 99, 235); // Blue
        doc.rect(0, 0, 210, 24, 'F');

        doc.setFillColor(124, 58, 237); // Purple accent bar
        doc.rect(0, 24, 210, 3, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('SMART EDUCATION SYSTEM - STUDY REVISION MATERIAL', 14, 15);

        // Document Metadata
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.text(mat.title, 14, 40, { maxWidth: 180 });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Subject: ${mat.subject}  |  Type: ${mat.type}  |  Pages: ${mat.pages}  |  Date: November 2026`, 14, 52);

        doc.setDrawColor(226, 232, 240);
        doc.line(14, 56, 196, 56);

        // Body Content
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(11);
        const splitText = doc.splitTextToSize(mat.content || mat.description, 180);
        doc.text(splitText, 14, 66);

        // Footer
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text('Smart Education System © 2026 | Learn Smart, Grow Smart | https://smartedu.edu', 14, 285);

        doc.save(`${mat.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.pdf`);
        showToast('PDF downloaded successfully! 🎓', 'success');
        return;
      }
    } catch (e) {
      console.warn('jsPDF generation failed, falling back to Blob download:', e);
    }

    // Fallback Blob Text Document Download
    const blob = new Blob([`${mat.title}\nSubject: ${mat.subject}\nType: ${mat.type}\n\n${mat.content || mat.description}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mat.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Material downloaded successfully! 🎓', 'success');
  }
}

let materialsController;
document.addEventListener('DOMContentLoaded', () => {
  materialsController = new MaterialsController();
  window.materialsController = materialsController;
});

