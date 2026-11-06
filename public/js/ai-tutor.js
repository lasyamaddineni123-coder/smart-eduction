/**
 * SMART EDUCATION SYSTEM - AI LEARNING ASSISTANT ("EduBot")
 */

class AiTutorController {
  constructor() {
    this.history = [];
    this.isTyping = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Dedicated AI Tutor Input & Form
    const aiForm = document.getElementById('ai-chat-form');
    if (aiForm) {
      aiForm.addEventListener('submit', (e) => this.handleSubmit(e, 'dedicated'));
    }

    // Floating Widget Toggle
    const floatingBtn = document.getElementById('floating-ai-trigger');
    const floatingModal = document.getElementById('floating-ai-modal');
    const floatingClose = document.getElementById('floating-ai-close');

    if (floatingBtn && floatingModal) {
      floatingBtn.addEventListener('click', () => {
        floatingModal.classList.toggle('active');
        if (floatingModal.classList.contains('active')) {
          document.getElementById('floating-ai-input')?.focus();
        }
      });
    }

    if (floatingClose && floatingModal) {
      floatingClose.addEventListener('click', () => {
        floatingModal.classList.remove('active');
      });
    }

    // Floating Chat Form
    const floatingForm = document.getElementById('floating-ai-form');
    if (floatingForm) {
      floatingForm.addEventListener('submit', (e) => this.handleSubmit(e, 'floating'));
    }

    // Prompt Chips click handlers
    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.currentTarget.textContent.trim().replace(/^💡|🔄|📅|🎯\s*/, '');
        this.sendMessage(text);
      });
    });
  }

  async handleSubmit(e, source = 'dedicated') {
    e.preventDefault();
    const inputEl = source === 'dedicated' 
      ? document.getElementById('ai-chat-input')
      : document.getElementById('floating-ai-input');

    if (!inputEl) return;
    const msg = inputEl.value.trim();
    if (!msg || this.isTyping) return;

    inputEl.value = '';
    await this.sendMessage(msg);
  }

  async sendMessage(msg) {
    this.isTyping = true;
    this.appendMessage('user', msg);
    this.showTypingIndicator();

    try {
      const res = await api.askAi(msg, this.history);
      this.hideTypingIndicator();
      this.appendMessage('bot', res.reply);
      this.history.push({ user: msg, bot: res.reply });
    } catch (err) {
      this.hideTypingIndicator();
      // Smart Fallback Explanation
      const fallbackReply = `### 💡 Smart Tutor Explanation\n\nRegarding **"${msg}"**:\n\n1. **Core Concept**: Learning this topic requires breaking it down into atomic principles.\n2. **Everyday Analogy**: Think of it like cooking a recipe: execute each step in order, verify results before proceeding.\n3. **Practical Tip**: Practice one coding problem or review the summary notes in the Study Materials section!\n\n💡 *Ask me for a practice quiz or study plan anytime!*`;
      this.appendMessage('bot', fallbackReply);
    } finally {
      this.isTyping = false;
    }
  }

  appendMessage(sender, text) {
    const formatted = this.formatMarkdown(text);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append to dedicated container
    const dedicatedBox = document.getElementById('ai-chat-messages');
    if (dedicatedBox) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${sender}`;
      bubble.innerHTML = `
        <div class="bubble-avatar ${sender}-avatar">
          <i class="fa-solid ${sender === 'bot' ? 'fa-robot' : 'fa-user'}"></i>
        </div>
        <div class="bubble-text">
          ${formatted}
          <div style="font-size: 0.72rem; opacity: 0.6; text-align: right; margin-top: 4px;">${time}</div>
        </div>
      `;
      dedicatedBox.appendChild(bubble);
      dedicatedBox.scrollTop = dedicatedBox.scrollHeight;
    }

    // Append to floating widget container
    const floatingBox = document.getElementById('floating-ai-messages');
    if (floatingBox) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${sender}`;
      bubble.innerHTML = `
        <div class="bubble-avatar ${sender}-avatar">
          <i class="fa-solid ${sender === 'bot' ? 'fa-robot' : 'fa-user'}"></i>
        </div>
        <div class="bubble-text">
          ${formatted}
        </div>
      `;
      floatingBox.appendChild(bubble);
      floatingBox.scrollTop = floatingBox.scrollHeight;
    }
  }

  showTypingIndicator() {
    ['ai-chat-messages', 'floating-ai-messages'].forEach(id => {
      const box = document.getElementById(id);
      if (!box) return;
      const indicator = document.createElement('div');
      indicator.id = `${id}-typing`;
      indicator.className = 'chat-bubble bot';
      indicator.innerHTML = `
        <div class="bubble-avatar bot-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="bubble-text" style="display: flex; gap: 4px; align-items: center; padding: 12px 18px;">
          <span style="animation: pulseAiDot 1s infinite;">●</span>
          <span style="animation: pulseAiDot 1s infinite 0.2s;">●</span>
          <span style="animation: pulseAiDot 1s infinite 0.4s;">●</span>
        </div>
      `;
      box.appendChild(indicator);
      box.scrollTop = box.scrollHeight;
    });
  }

  hideTypingIndicator() {
    ['ai-chat-messages-typing', 'floating-ai-messages-typing'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  formatMarkdown(text) {
    if (!text) return '';
    let parsed = text
      .replace(/### (.*?)\n/g, '<h4 style="font-size: 1.1rem; color: var(--accent-purple); margin: 6px 0 8px;">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```python([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/```javascript([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px; font-size: 0.88rem;">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n- /g, '<br>• ');

    return parsed;
  }
}

let aiTutorController;
document.addEventListener('DOMContentLoaded', () => {
  aiTutorController = new AiTutorController();
  window.aiTutorController = aiTutorController;
});

