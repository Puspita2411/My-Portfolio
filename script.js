/* =============================================
   PUSPITA PRAMANIK — PORTFOLIO JAVASCRIPT
   Features: Typing, Scroll Animations, Dark/Light,
   Filter, Navbar, Form, Skill Bars
   ============================================= */

'use strict';

// ============ THEME TOGGLE ============
const themeToggle = document.getElementById('themeToggle');
const toggleIcon  = document.getElementById('toggleIcon');
const htmlEl      = document.documentElement;

function setTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Load saved theme (default = dark)
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ============ NAVBAR ============
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

// Scroll to apply "scrolled" class
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
}, { passive: true });

// Hamburger menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}

// Active link on scroll
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId     = section.getAttribute('id');
    const link          = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (link) {
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ============ TYPING ANIMATION ============
const typedEl = document.getElementById('typedText');
const phrases = [
  '3rd Year CSE Student',
  'Full-Stack Developer',
  'DSA Enthusiast',
  'Systems Programmer',
  'Open Source Contributor',
  'Problem Solver ✨',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimeout;

function type() {
  const currentPhrase = phrases[phraseIndex];
  const displayed = isDeleting
    ? currentPhrase.substring(0, charIndex - 1)
    : currentPhrase.substring(0, charIndex + 1);

  typedEl.textContent = displayed;

  if (!isDeleting) {
    charIndex++;
    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      typingTimeout = setTimeout(type, 2000);
      return;
    }
  } else {
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingTimeout = setTimeout(type, 400);
      return;
    }
  }

  const speed = isDeleting ? 45 : 90;
  typingTimeout = setTimeout(type, speed);
}

type();

// ============ SCROLL-TRIGGERED ANIMATIONS ============
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px',
};

// Animate elements on scroll
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('animate-in');
        entry.target.style.animationDelay = `${i * 0.08}s`;
      }, i * 80);
      animObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe cards, sections, etc.
document.querySelectorAll(
  '.about-card, .project-card, .skill-category, .fundamental-badge, .timeline-item, .stat-card, .contact-detail-item, .contact-form'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  animObserver.observe(el);
});

// Override animate-in to handle inline styles
const animIn = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      animIn.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll(
  '.about-card, .project-card, .skill-category, .fundamental-badge, .timeline-item, .stat-card, .contact-detail-item, .contact-form'
).forEach(el => animIn.observe(el));

// ============ SKILL BAR ANIMATION ============
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animated'), i * 150);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

// ============ PROJECT FILTER ============
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.classList.add('hidden');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.92)';
      }
    });
  });
});

// ============ CONTACT FORM — Web3Forms (delivers to Gmail) ============
async function handleFormSubmit(e) {
  e.preventDefault();
  const btn        = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg   = document.getElementById('formError');
  const form       = document.getElementById('contactForm');

  // Hide previous messages
  successMsg.classList.remove('visible');
  errorMsg.classList.remove('visible');

  // Update hidden subject to use the user's entered subject
  const subjectVal = document.getElementById('contactSubject').value;
  document.getElementById('hiddenSubject').value = `Portfolio Contact: ${subjectVal}`;

  // Show loading state
  btn.disabled = true;
  btn.innerHTML = `<span>Sending...</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;width:18px;height:18px">
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>`;

  try {
    const formData = new FormData(form);
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });
    const data = await response.json();

    if (data.success) {
      successMsg.classList.add('visible');
      form.reset();
      setTimeout(() => successMsg.classList.remove('visible'), 6000);
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    console.error('Form error:', err);
    errorMsg.classList.add('visible');
    setTimeout(() => errorMsg.classList.remove('visible'), 8000);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>Send Message</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>`;
  }
}

// Spin keyframe for submit btn loading
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

// ============ SMOOTH SECTION REVEALS ============
// Add staggered reveal for hero elements
window.addEventListener('load', () => {
  const heroEls = [
    document.querySelector('.hero-greeting'),
    document.querySelector('.hero-name'),
    document.querySelector('.hero-role'),
    document.querySelector('.hero-desc'),
    document.querySelector('.hero-cta'),
    document.querySelector('.hero-socials'),
  ];

  heroEls.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });

  const heroImg = document.querySelector('.avatar-wrapper');
  if (heroImg) {
    heroImg.style.opacity = '0';
    heroImg.style.transform = 'scale(0.85)';
    heroImg.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => {
      heroImg.style.opacity = '1';
      heroImg.style.transform = 'scale(1)';
    }, 400);
  }
});

// ============ RESUME BUTTON ============
// Resume button uses native anchor download — no JS override needed.

// ============ CURSOR GLOW EFFECT ============
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, hsla(330, 80%, 60%, 0.06) 0%, transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 0;
  transition: transform 0.1s linear;
  will-change: left, top;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
}, { passive: true });

// ============ PARTICLES IN HERO ============
function createParticle() {
  const hero = document.querySelector('.hero-bg-orbs');
  if (!hero || window.innerWidth < 768) return;

  const particle = document.createElement('div');
  const size = Math.random() * 4 + 2;
  const x = Math.random() * window.innerWidth;
  const duration = Math.random() * 6 + 4;
  const delay = Math.random() * 3;

  particle.style.cssText = `
    position: absolute;
    left: ${x}px;
    bottom: -10px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: hsla(330, 80%, 65%, ${Math.random() * 0.4 + 0.1});
    animation: particleRise ${duration}s ${delay}s ease-in forwards;
    pointer-events: none;
  `;

  hero.appendChild(particle);
  setTimeout(() => particle.remove(), (duration + delay) * 1000);
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes particleRise {
    0%   { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-${window.innerHeight + 50}px) scale(0); opacity: 0; }
  }
`;
document.head.appendChild(particleStyle);

// Spawn particles periodically
setInterval(createParticle, 1200);
