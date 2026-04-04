/* ============================================================
   MOHAN KOIRALA — PREMIUM PORTFOLIO JS
   ============================================================ */

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    // Trigger hero entrance after preloader
    document.querySelectorAll('.hero-content, .hero-visual').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.8s ease ${i * 0.2}s, transform 0.8s ease ${i * 0.2}s`;
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  }, 2000);
});

// ===== SCROLL PROGRESS BAR =====
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = `${(scrolled / total) * 100}%`;
}, { passive: true });

// ===== CUSTOM CURSOR GLOW =====
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Smooth cursor follow using rAF
function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
  });
});

// ===== PARTICLE BACKGROUND (DEPTH LAYERS) =====
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x       = Math.random() * canvas.width;
    this.y       = init ? Math.random() * canvas.height : canvas.height + 10;
    this.layer   = Math.floor(Math.random() * 3); // 0=far, 1=mid, 2=near
    this.size    = [0.5, 1.1, 1.8][this.layer];
    this.speed   = [0.15, 0.3, 0.5][this.layer];
    this.opacity = [0.2, 0.4, 0.65][this.layer];
    this.speedX  = (Math.random() - 0.5) * this.speed;
    this.speedY  = -(Math.random() * this.speed + 0.1);
    this.color   = Math.random() > 0.55 ? '124,111,255' : '0,212,255';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.y < -5 || this.x < -5 || this.x > canvas.width + 5) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

const PARTICLE_COUNT = 90;
const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

function connectParticles() {
  const near = particles.filter(p => p.layer === 2);
  for (let i = 0; i < near.length; i++) {
    for (let j = i + 1; j < near.length; j++) {
      const dx   = near[i].x - near[j].x;
      const dy   = near[i].y - near[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124,111,255,${0.07 * (1 - dist / 130)})`;
        ctx.lineWidth   = 0.6;
        ctx.moveTo(near[i].x, near[i].y);
        ctx.lineTo(near[j].x, near[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Subtle gradient overlay on canvas
  const grad = ctx.createRadialGradient(
    canvas.width * 0.5, canvas.height * 0.3, 0,
    canvas.width * 0.5, canvas.height * 0.3, canvas.width * 0.6
  );
  grad.addColorStop(0, 'rgba(124,111,255,0.03)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== PARALLAX HERO ON MOUSE MOVE =====
const heroContent = document.querySelector('.hero-content');
const heroVisual  = document.querySelector('.hero-visual');

document.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  if (heroContent) heroContent.style.transform = `translate(${dx * 8}px, ${dy * 5}px)`;
  if (heroVisual)  heroVisual.style.transform  = `translate(${dx * -14}px, ${dy * -10}px)`;
});

// ===== NAVBAR SCROLL SHRINK =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== HAMBURGER — MOBILE DRAWER =====
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.createElement('div');
mobileNav.className = 'mobile-nav';
mobileNav.innerHTML = `
  <a href="#about"     class="mobile-link">About</a>
  <a href="#skills"    class="mobile-link">Skills</a>
  <a href="#projects"  class="mobile-link">Projects</a>
  <a href="#education" class="mobile-link">Education</a>
  <a href="#contact"   class="mobile-link">Contact</a>
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

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 220) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// ===== SCROLL REVEAL ANIMATIONS =====
const revealEls = document.querySelectorAll(
  '.about-card, .info-card, .skill-card, .project-card, .timeline-item, .contact-card, .contact-cta-box, .section-header'
);
revealEls.forEach(el => el.classList.add('fade-up'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered delay based on sibling index
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target  = parseInt(el.dataset.count);
  const suffix  = el.dataset.suffix || '';
  const duration = 1800;
  const step     = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObserver.observe(el));

// ===== SKILL PROGRESS BARS ANIMATION =====
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => barObserver.observe(card));

// ===== SKILL TABS FILTER =====
const tabs = document.querySelectorAll('.skill-tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const group = tab.dataset.group;
    document.querySelectorAll('.skill-card').forEach(card => {
      if (group === 'all' || card.dataset.group === group) {
        card.classList.remove('hidden');
        // Re-trigger fade
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== VANILLA TILT 3D =====
document.addEventListener('DOMContentLoaded', () => {
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max:        7,
      speed:      500,
      glare:      true,
      'max-glare': 0.07,
      perspective: 1200,
      scale:       1.02,
    });
  }
});

// ===== TYPING EFFECT (IMPROVED) =====
const roles = [
  'a Data Analyst',
  'a Power BI Developer',
  'an AI / ML Enthusiast',
  'an Aspiring Data Engineer',
  'an IT Engineer',
];
let roleIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.querySelector('.typed-dynamic');

function type() {
  if (!typedEl) return;
  const word = roles[roleIndex];

  if (!deleting) {
    typedEl.textContent = word.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === word.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typedEl.textContent = word.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 55 : 95);
}

setTimeout(type, 2400); // start after preloader

// ===== SMOOTH SCROLL EASING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ===== FEATURE 1: BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== FEATURE 2: SIDE DOT NAVIGATION + SECTION COUNTER =====
const sideNavItems = document.querySelectorAll('.side-nav-item');
const secCurrent   = document.getElementById('sec-current');
const allSections  = document.querySelectorAll('section[id]');

function updateSideNav() {
  let currentIdx = 0;
  allSections.forEach((sec, i) => {
    if (window.scrollY >= sec.offsetTop - 300) currentIdx = i;
  });

  sideNavItems.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIdx);
  });

  if (secCurrent) {
    secCurrent.textContent = String(currentIdx + 1).padStart(2, '0');
  }
}

window.addEventListener('scroll', updateSideNav, { passive: true });
updateSideNav();

sideNavItems.forEach(dot => {
  dot.addEventListener('click', () => {
    const target = document.getElementById(dot.dataset.section);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== FEATURE 3: DARK / LIGHT MODE TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');

function applyTheme(mode) {
  if (mode === 'light') {
    document.body.classList.add('light-mode');
    themeIcon.className = 'fa-solid fa-sun';
  } else {
    document.body.classList.remove('light-mode');
    themeIcon.className = 'fa-solid fa-moon';
  }
}

// Restore saved preference
const savedTheme = localStorage.getItem('mk-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light-mode');
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('mk-theme', next);
});

// ===== CONTACT FORM — Web3Forms (sends directly to Gmail) =====
const contactForm   = document.getElementById('contact-form');
const formStatus    = document.getElementById('form-status');
const formSubmitBtn = document.getElementById('form-submit-btn');
const formBtnText   = document.getElementById('form-btn-text');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate
    let valid = true;
    contactForm.querySelectorAll('input:not([type=hidden]), textarea').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) { field.classList.add('error'); valid = false; }
    });
    if (!valid) {
      formStatus.textContent = 'Please fill in all fields.';
      formStatus.className = 'form-status error';
      return;
    }

    // Loading state
    formSubmitBtn.disabled = true;
    formBtnText.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const formData = new FormData(contactForm);
      // Override subject to include sender name
      formData.set('subject', `Portfolio Message from ${formData.get('from_name')}`);

      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        formStatus.textContent = '\u2705 Message sent! I\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      formStatus.textContent = '\u274C Something went wrong. Please email me directly.';
      formStatus.className = 'form-status error';
    } finally {
      formSubmitBtn.disabled = false;
      formBtnText.textContent = 'Send Message';
    }
  });
}


// ===== SEND AN EMAIL BUTTON — scroll to form & focus first field =====
const sendEmailBtn = document.getElementById('send-email-btn');
if (sendEmailBtn) {
  sendEmailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.getElementById('contact-form');
    const nameField = document.getElementById('cf-name');
    if (!form || !nameField) return;
    const top = form.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: 'smooth' });
    setTimeout(() => nameField.focus(), 600);
  });
}
