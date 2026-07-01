/* =========================================================
   NayePankh Foundation — JavaScript
   ========================================================= */

(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme Toggle ---------- */
  const themeToggle = $('#themeToggle');
  const themeIcon = themeToggle?.querySelector('i');
  const applyTheme = (theme) => {
    document.body.classList.toggle('dark', theme === 'dark');
    if (themeIcon) themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  };
  const savedTheme = localStorage.getItem('np-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);
  themeToggle?.addEventListener('click', () => {
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('np-theme', next);
    applyTheme(next);
  });

  /* ---------- Mobile Nav ---------- */
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');
  const closeNav = () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  };
  hamburger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-link').forEach(l => l.addEventListener('click', closeNav));

  /* ---------- Scroll: navbar shadow, progress, back-to-top, active link ---------- */
  const navbar = $('#navbar');
  const progress = $('#scrollProgress');
  const backToTop = $('#backToTop');
  const sections = $$('section[id]');
  const navMap = new Map($$('.nav-link').map(a => [a.getAttribute('href'), a]));

  const onScroll = () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 20);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${(y / h) * 100}%`;
    backToTop?.classList.toggle('visible', y > 400);

    // active link
    const pos = y + 120;
    let currentId = sections[0]?.id;
    for (const s of sections) {
      if (s.offsetTop <= pos) currentId = s.id;
    }
    navMap.forEach((el, href) => el.classList.toggle('active', href === `#${currentId}`));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Animated Counters ---------- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const runCounter = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(easeOut(p) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { runCounter(e.target); counterIO.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  $$('.count').forEach(el => counterIO.observe(el));

  /* ---------- Typing effect ---------- */
  const typedEl = $('#typed');
  if (typedEl) {
    const phrases = [
      'Empowering Youth,',
      'Transforming Lives,',
      'Building Futures.'
    ];
    let pi = 0, ci = 0, deleting = false;
    const tick = () => {
      const current = phrases[pi];
      typedEl.textContent = current.slice(0, ci);
      let delay = deleting ? 40 : 90;
      if (!deleting && ci === current.length) { delay = 1400; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 300; }
      else ci += deleting ? -1 : 1;
      setTimeout(tick, delay);
    };
    tick();
  }

  /* ---------- Form validation ---------- */
  const form = $('#contactForm');
  const success = $('#formSuccess');
  const showError = (input, msg) => {
    const small = input.parentElement.querySelector('.error');
    if (small) small.textContent = msg || '';
    input.style.borderColor = msg ? '#EF4444' : '';
  };
  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your name (2+ characters).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.',
    phone: (v) => !v || /^[+\d\s()-]{7,}$/.test(v.trim()) ? '' : 'Enter a valid phone number.',
    message: (v) => v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.'
  };
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    Object.keys(validators).forEach(name => {
      const input = form.elements[name];
      const msg = validators[name](input.value);
      showError(input, msg);
      if (msg) ok = false;
    });
    if (ok) {
      form.reset();
      success.hidden = false;
      setTimeout(() => (success.hidden = true), 5000);
    }
  });
  form?.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      const v = validators[input.name];
      if (v) showError(input, v(input.value));
    });
  });
})();
