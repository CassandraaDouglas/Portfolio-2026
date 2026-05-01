/* ============================================
   CASSANDRA DOUGLAS — PORTFOLIO JS
   ============================================ */

const FOLLOWER_LERP  = 0.28;
const HOVER_SELECTOR = 'a, button, .btn, .work-card, input, textarea, label';

// ── CUSTOM CURSOR ─────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  (function animateCursor() {
    followerX += (mouseX - followerX) * FOLLOWER_LERP;
    followerY += (mouseY - followerY) * FOLLOWER_LERP;
    cursor.style.left = followerX + 'px';
    cursor.style.top  = followerY + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.body.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_SELECTOR)) cursor.classList.add('cursor--hover');
  });
  document.body.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER_SELECTOR)) cursor.classList.remove('cursor--hover');
  });
}

// ── SCROLL PROGRESS BAR ───────────────────
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

// ── NAV + PARALLAX + PROGRESS (batched) ───
const nav       = document.getElementById('nav');
const heroInner = document.querySelector('.hero__inner');
let   ticking   = false;

function onScrollFrame() {
  const y     = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;

  // Scroll progress bar
  progressBar.style.width = total > 0 ? (y / total * 100) + '%' : '0%';

  // Nav glass on scroll
  if (nav) nav.classList.toggle('scrolled', y > 20);

  // Hero parallax — content drifts up at 18% scroll rate, fades as hero exits
  if (heroInner) {
    heroInner.style.transform = `translateY(${y * 0.18}px)`;
    heroInner.style.opacity   = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(onScrollFrame);
    ticking = true;
  }
}, { passive: true });
onScrollFrame();

// ── ACTIVE NAV LINK ───────────────────────
const currentFile = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (
    href === currentFile ||
    (currentFile === '' && href === 'index.html') ||
    (currentFile.startsWith('case-study') && href === 'work.html')
  ) {
    link.classList.add('active');
  }
});

// ── SCROLL ANIMATIONS ─────────────────────
if ('IntersectionObserver' in window) {
  const STAGGER_MS = 110;

  // Group observer: fires all direct .fade-section children of a parent in staggered sequence
  const groupObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const children = [...entry.target.querySelectorAll(':scope > .fade-section')];
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * STAGGER_MS);
      });
      groupObserver.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  // Solo observer: for .fade-section elements whose parent has only one
  const soloObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        soloObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  // Sort elements into groups vs solo
  const staggerParents = new Set();
  document.querySelectorAll('.fade-section').forEach(el => {
    const siblings = el.parentElement.querySelectorAll(':scope > .fade-section').length;
    if (siblings >= 2) staggerParents.add(el.parentElement);
  });

  staggerParents.forEach(parent => groupObserver.observe(parent));

  document.querySelectorAll('.fade-section').forEach(el => {
    if (!staggerParents.has(el.parentElement)) soloObserver.observe(el);
  });
}

// ── NUMBER COUNTER (about stats) ──────────
const statNumbers = document.querySelectorAll('.stat__number');
if (statNumbers.length && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const raw    = el.textContent.trim();      // e.g. "8+" or "3×"
      const target = parseInt(raw, 10);
      const suffix = raw.replace(/^\d+/, '');    // the non-digit tail

      if (isNaN(target) || target === 0) return;

      const duration  = 1400;
      const startTime = performance.now();

      (function tick(now) {
        const t     = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(2, -10 * t); // ease-out-expo
        el.textContent = Math.round(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      })(performance.now());

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
}

// ── CONTACT FORM ──────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      contactForm.closest('.contact-form').classList.add('submitted');
    }, 1000);
  });
}

// ── RESUME PRINT ──────────────────────────
const printBtn = document.getElementById('printResume');
if (printBtn) {
  printBtn.addEventListener('click', () => window.print());
}

// ── SETTINGS PANEL ────────────────────────
const THEME_KEY = 'cd_theme';
const A11Y_KEY  = 'cd_a11y';

function getA11y() { return JSON.parse(localStorage.getItem(A11Y_KEY) || '{}'); }
function saveA11y(obj) { localStorage.setItem(A11Y_KEY, JSON.stringify(obj)); }

function applyTheme(theme) {
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('theme-dark', isDark);
}

function syncThemeBtns(theme) {
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

function loadAtkinson() {
  if (!document.querySelector('link[data-atkinson]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.dataset.atkinson = '1';
    link.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap';
    document.head.appendChild(link);
  }
}

(function initSettings() {
  const A11Y_ROWS = [
    ['toggleReduceMotion', 'reduceMotion', 'Reduce Motion',      'Disable animations & transitions'],
    ['toggleHighContrast', 'highContrast', 'High Contrast',      'Boost visual contrast ratios'],
    ['toggleLargeText',    'largeText',    'Larger Text',         'Scale all text up ~12%'],
    ['toggleDyslexia',     'dyslexia',     'Dyslexia Font',       'Switch to Atkinson Hyperlegible'],
    ['toggleLineSpacing',  'lineSpacing',  'Increased Spacing',   'More space between lines'],
  ];

  const CLASS_MAP = {
    reduceMotion: 'a11y-reduce-motion',
    highContrast: 'a11y-high-contrast',
    largeText:    'a11y-large-text',
    dyslexia:     'a11y-dyslexia',
    lineSpacing:  'a11y-line-spacing',
  };

  const rowsHTML = A11Y_ROWS.map(([id, key, name, desc]) => `
    <div class="a11y-row">
      <div class="a11y-row__text">
        <span class="a11y-row__name">${name}</span>
        <span class="a11y-row__desc">${desc}</span>
      </div>
      <label class="toggle" aria-label="${name}">
        <input type="checkbox" id="${id}" data-key="${key}">
        <span class="toggle__track"></span>
        <span class="toggle__thumb"></span>
      </label>
    </div>`).join('');

  document.body.insertAdjacentHTML('beforeend', `
    <div class="settings-overlay" id="settingsOverlay"></div>
    <div class="settings-panel" id="settingsPanel" role="dialog" aria-modal="true" aria-label="Display settings">
      <div class="settings-panel__header">
        <span class="settings-panel__title">Display Settings</span>
        <button class="settings-panel__close" id="settingsClose" aria-label="Close settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="settings-section">
        <p class="settings-section__label">Theme</p>
        <div class="theme-toggle">
          <button class="theme-btn" data-theme="light">
            <svg class="theme-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <span class="theme-btn__label">Light</span>
          </button>
          <button class="theme-btn" data-theme="dark">
            <svg class="theme-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <span class="theme-btn__label">Dark</span>
          </button>
          <button class="theme-btn" data-theme="system">
            <svg class="theme-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            <span class="theme-btn__label">System</span>
          </button>
        </div>
      </div>
      <div class="settings-section">
        <p class="settings-section__label">Accessibility</p>
        <div class="a11y-toggles">${rowsHTML}</div>
      </div>
    </div>`);

  const panel    = document.getElementById('settingsPanel');
  const overlay  = document.getElementById('settingsOverlay');
  const openBtn  = document.getElementById('settingsBtn');
  const closeBtn = document.getElementById('settingsClose');

  function openPanel()  {
    panel.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBtn)  openBtn.addEventListener('click', openPanel);
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (overlay)  overlay.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

  // Restore saved state into UI
  const savedTheme = localStorage.getItem(THEME_KEY) || 'system';
  syncThemeBtns(savedTheme);

  const savedA11y = getA11y();
  document.querySelectorAll('.a11y-toggles input[type="checkbox"]').forEach(input => {
    input.checked = !!savedA11y[input.dataset.key];
  });

  if (savedA11y.dyslexia) loadAtkinson();

  // Theme buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      localStorage.setItem(THEME_KEY, theme);
      applyTheme(theme);
      syncThemeBtns(theme);
    });
  });

  // A11y toggles
  document.querySelectorAll('.a11y-toggles input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      const key  = input.dataset.key;
      const a11y = getA11y();
      a11y[key]  = input.checked;
      saveA11y(a11y);
      document.documentElement.classList.toggle(CLASS_MAP[key], input.checked);
      if (key === 'dyslexia' && input.checked) loadAtkinson();
    });
  });

  // Respond to OS dark mode change when set to system
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem(THEME_KEY) || 'system') === 'system') applyTheme('system');
  });
})();
