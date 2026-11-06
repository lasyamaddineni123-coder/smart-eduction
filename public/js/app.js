/**
 * SMART EDUCATION SYSTEM - CORE APP & ROUTER
 */

// Toast System
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';
  if (type === 'warning') icon = 'fa-circle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="font-size: 1.2rem; color: var(--${type === 'info' ? 'primary' : type});"></i>
    <span style="flex: 1;">${message}</span>
  `;

  container.appendChild(toast);

  // Play subtle chime sound
  playAudioChime(type);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Web Audio API Chime synthesizer
function playAudioChime(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'error') {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

// Router & Section Switcher
function navigateTo(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => sec.style.display = 'none');

  // Show target section
  const target = document.getElementById(`section-${sectionId}`);
  if (target) {
    target.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update navbar links
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update mobile bottom nav
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    if (item.getAttribute('data-section') === sectionId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Close mobile drawer if open
  const navLinks = document.getElementById('nav-links');
  if (navLinks) navLinks.classList.remove('open');

  // Sync Hash
  if (window.location.hash !== `#${sectionId}`) {
    history.pushState(null, '', `#${sectionId}`);
  }
}

// Global App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll detection
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Nav link click events
  document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = e.currentTarget.getAttribute('data-section');
      if (section) navigateTo(section);
    });
  });

  // Hash change detection
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
  });

  // Initial load navigation
  const initialHash = window.location.hash.replace('#', '') || 'home';
  navigateTo(initialHash);
});

