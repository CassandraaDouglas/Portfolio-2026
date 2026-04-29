/* ============================================
   CASSANDRA DOUGLAS — PORTFOLIO JS
   ============================================ */

const FOLLOWER_LERP    = 0.12;
const HOVER_SELECTOR   = 'a, button, .btn, .work-card, input, textarea';

// ── CUSTOM CURSOR ─────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

if (cursor && follower) {
  // Update state only on mousemove; all DOM writes happen in rAF
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  // Single rAF loop for all cursor DOM writes
  (function animateCursor() {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';

    followerX += (mouseX - followerX) * FOLLOWER_LERP;
    followerY += (mouseY - followerY) * FOLLOWER_LERP;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';

    requestAnimationFrame(animateCursor);
  })();

  // Event delegation — one listener pair instead of N
  document.body.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVER_SELECTOR)) {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor-follower--hover');
    }
  });
  document.body.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVER_SELECTOR)) {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor-follower--hover');
    }
  });
}

// ── NAV SCROLL ────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

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
const fadeSections = document.querySelectorAll('.fade-section');
if (fadeSections.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  fadeSections.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.1}s`;
    observer.observe(el);
  });
}

// ── CONTACT FORM ──────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate send delay for static site, then toggle submitted state via CSS class
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
