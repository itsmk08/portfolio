/* ============================================================
   MOHAN KOIRALA — PORTFOLIO JS
   ============================================================ */

// ===== PRELOADER =====
// Force hide after 2.5s no matter what
setTimeout(() => {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.classList.add('hidden');
}, 2500);

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.classList.add('hidden');
});

// ===== SCROLL PROGRESS BAR =====
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollBar) scrollBar.style.width = `${(window.scrollY / total) * 100}%`;
}, { passive: true });

// ===== CUSTOM CURSOR GLOW =====
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) { cursorGlow.style.left = glowX + 'px'; cursorGlow.style.top = glowY + 'px'; }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
  });
});

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

const bgColors = {
  galaxy: ['124,111,255', '0,212,255'],
  ocean:  ['0,180,216',   '72,202,228'],
  aurora: ['0,200,150',   '168,85,247'],
};
let activeColors = bgColors.galaxy;

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x      = Math.random() * canvas.width;
    this.y      = init ? Math.random() * canvas.height : canvas.height + 10;
    this.layer  = Math.floor(Math.random() * 3);
    this.size   = [0.5, 1.1, 1.8][this.layer];
    this.speed  = [0.15, 0.3, 0.5][this.layer];
    this.opacity= [0.2, 0.4, 0.65][this.layer];
    this.speedX = (Math.random() - 0.5) * this.speed;
    this.speedY = -(Math.random() * this.speed + 0.1);
    this.color  = activeColors[Math.random() > 0.5 ? 0 : 1];
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.y < -5 || this.x < -5 || this.x > canvas.width + 5) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: 90 }, () => new Particle());

function connectParticles() {
  const near = particles.filter(p => p.layer === 2);
  for (let i = 0; i < near.length; i++) {
    for (let j = i + 1; j < near.length; j++) {
      const dx = near[i].x - near[j].x, dy = near[i].y - near[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${activeColors[0]},${0.07 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(near[i].x, near[i].y);
        ctx.lineTo(near[j].x, near[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== PARALLAX HERO =====
const heroContent = document.querySelector('.hero-content');
const heroVisual  = document.querySelector('.hero-visual');
document.addEventListener('mousemove', e => {
  const dx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
  const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
  if (heroContent) heroContent.style.transform = `translate(${dx * 8}px, ${dy * 5}px)`;
  if (heroVisual)  heroVisual.style.transform  = `translate(${dx * -14}px, ${dy * -10}px)`;
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== HAMBURGER MOBILE DRAWER =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.createElement('div');
mobileNav.className = 'mobile-nav';
mobileNav.innerHTML = `
  <a href="#about"          class="mobile-link">About</a>
  <a href="#skills"         class="mobile-link">Skills</a>
  <a href="#projects"       class="mobile-link">Projects</a>
  <a href="#education"      class="mobile-link">Education</a>
  <a href="#certifications" class="mobile-link">Certifications</a>
  <a href="#contact"        class="mobile-link">Contact</a>
`;
document.body.appendChild(mobileNav);

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});
mobileNav.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== ACTIVE NAV LINK =====
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 220) current = sec.id; });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}, { passive: true });

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.about-card, .about-right, .skill-card, .project-card, .timeline-item, .contact-card, .contact-cta-box, .section-header, .cert-card, .github-card'
);
revealEls.forEach(el => el.classList.add('fade-up'));
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = [...entry.target.parentElement.children].indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const increment = target / (1800 / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { el.textContent = target.toLocaleString() + suffix; clearInterval(timer); }
    else el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObserver.observe(el));

// ===== SKILL BARS =====
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(card => barObserver.observe(card));

// ===== SKILL TABS =====
document.querySelectorAll('.skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const group = tab.dataset.group;
    document.querySelectorAll('.skill-card').forEach(card => {
      const show = group === 'all' || card.dataset.group === group;
      card.classList.toggle('hidden', !show);
      if (show) { card.classList.remove('visible'); setTimeout(() => card.classList.add('visible'), 50); }
    });
  });
});

// ===== VANILLA TILT =====
document.addEventListener('DOMContentLoaded', () => {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max: 7, speed: 500, glare: true, 'max-glare': 0.07, perspective: 1200, scale: 1.02,
    });
  }
});

// ===== TYPING EFFECT =====
const roles = ['a Data Analyst', 'a Power BI Developer', 'an AI / ML Enthusiast', 'an IT Engineer'];
let roleIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.querySelector('.typed-dynamic');
function type() {
  if (!typedEl) return;
  const word = roles[roleIndex];
  if (!deleting) {
    typedEl.textContent = word.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === word.length) { deleting = true; setTimeout(type, 2000); return; }
  } else {
    typedEl.textContent = word.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 55 : 95);
}
setTimeout(type, 1000);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => { if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400); }, { passive: true });
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== SIDE DOT NAV + SECTION COUNTER =====
const sideNavItems = document.querySelectorAll('.side-nav-item');
const secCurrent   = document.getElementById('sec-current');
const allSections  = document.querySelectorAll('section[id]');
function updateSideNav() {
  let idx = 0;
  allSections.forEach((sec, i) => { if (window.scrollY >= sec.offsetTop - 300) idx = i; });
  sideNavItems.forEach((dot, i) => dot.classList.toggle('active', i === idx));
  if (secCurrent) secCurrent.textContent = String(idx + 1).padStart(2, '0');
}
window.addEventListener('scroll', updateSideNav, { passive: true });
updateSideNav();
sideNavItems.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.getElementById(dot.dataset.section);
    if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

// ===== DARK / LIGHT MODE =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
function applyTheme(mode) {
  document.body.classList.toggle('light-mode', mode === 'light');
  if (themeIcon) themeIcon.className = mode === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}
applyTheme(localStorage.getItem('mk-theme') || 'dark');
if (themeToggle) themeToggle.addEventListener('click', () => {
  const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('mk-theme', next);
});

// ===== CONTACT FORM (Web3Forms) =====
const contactForm   = document.getElementById('contact-form');
const formStatus    = document.getElementById('form-status');
const formSubmitBtn = document.getElementById('form-submit-btn');
const formBtnText   = document.getElementById('form-btn-text');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('input:not([type=hidden]), textarea').forEach(f => {
      f.classList.remove('error');
      if (!f.value.trim()) { f.classList.add('error'); valid = false; }
    });
    if (!valid) { formStatus.textContent = 'Please fill in all fields.'; formStatus.className = 'form-status error'; return; }
    formSubmitBtn.disabled = true;
    formBtnText.textContent = 'Sending...';
    formStatus.textContent = '';
    try {
      const fd = new FormData(contactForm);
      fd.set('subject', `Portfolio Message from ${fd.get('from_name')}`);
      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { formStatus.textContent = '✅ Message sent! I\'ll get back to you soon.'; formStatus.className = 'form-status success'; contactForm.reset(); }
      else throw new Error();
    } catch { formStatus.textContent = '❌ Something went wrong. Please email me directly.'; formStatus.className = 'form-status error'; }
    finally { formSubmitBtn.disabled = false; formBtnText.textContent = 'Send Message'; }
  });
}

// ===== SEND AN EMAIL BUTTON =====
const sendEmailBtn = document.getElementById('send-email-btn');
if (sendEmailBtn) {
  sendEmailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.getElementById('contact-form');
    const nameField = document.getElementById('cf-name');
    if (!form || !nameField) return;
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
    setTimeout(() => nameField.focus(), 600);
  });
}

// ===== BACKGROUND THEME SWITCHER =====
function applyBgTheme(theme) {
  document.body.classList.remove('bg-galaxy', 'bg-ocean', 'bg-aurora');
  document.body.classList.add(`bg-${theme}`);
  document.querySelectorAll('.bg-btn').forEach(b => b.classList.toggle('active', b.dataset.bg === theme));
  activeColors = bgColors[theme] || bgColors.galaxy;
  particles.forEach(p => { p.color = activeColors[Math.random() > 0.5 ? 0 : 1]; });
  localStorage.setItem('mk-bg', theme);
}
applyBgTheme(localStorage.getItem('mk-bg') || 'galaxy');
document.querySelectorAll('.bg-btn').forEach(btn => btn.addEventListener('click', () => applyBgTheme(btn.dataset.bg)));
