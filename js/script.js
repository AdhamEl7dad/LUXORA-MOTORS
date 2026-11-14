/* ============================================================
   LUXORA MOTORS — Shared interactions
   Navigation, scroll reveals, gallery lightbox, form validation
   ============================================================ */

/* ---------- Paths & image fallbacks ---------- */
const ROOT = window.location.pathname.includes('/pages/') ? '../' : '';

/* If an external photo fails to load, swap in a local fallback image so the layout never breaks */
function swapToFallback(img) {
  if (img.dataset.failed) return;
  img.dataset.failed = '1';
  if (img.parentElement) img.parentElement.classList.add('is-missing');
  img.src = ROOT + (img.dataset.fallback || 'images/fallback/placeholder.jpg');
}
function initImageFallbacks() {
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') swapToFallback(e.target);
  }, true);
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) swapToFallback(img);
  });
}

/* ---------- Sticky navigation state ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.querySelector('.navbar__toggle');
  const menu = document.querySelector('.navbar__menu');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 768) setOpen(false); });
}

/* ---------- Active nav link ----------
   Other pages: highlight the link that points to the current file.
   Home page: highlight the section currently in view (scroll spy). */
function setActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const links = [...document.querySelectorAll('.navbar__link')];
  const fileOf = (href) => href.split('#')[0].split('/').pop();

  if (page !== 'index.html') {
    links.forEach((l) => {
      const href = l.getAttribute('href') || '';
      l.classList.toggle('is-active', !href.includes('#') && fileOf(href) === page);
    });
    return;
  }

  const items = links
    .filter((l) => (l.getAttribute('href') || '').startsWith('#'))
    .map((l) => ({ link: l, section: document.querySelector(l.getAttribute('href')) }))
    .filter((x) => x.section);

  const update = () => {
    const y = window.scrollY + 140;
    let current = items[0];
    items.forEach((x) => { if (x.section.offsetTop <= y) current = x; });
    links.forEach((l) => l.classList.toggle('is-active', current && l === current.link));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- Scroll reveal animations ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------- Gallery lightbox (event delegation, works for dynamically rendered items) ---------- */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;
  const image = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item, .ba-frame');
    const img = item && item.querySelector('img');
    if (!img) return;
    image.src = img.src;
    image.alt = img.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const successBox = form.querySelector('.form-success');

  const validators = {
    name: (v) => v.trim().length >= 3 || 'Please enter your full name (at least 3 characters).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
    phone: (v) => /^[+\d][\d\s\-()]{6,}$/.test(v.trim()) || 'Please enter a valid phone number (digits, spaces, + - ( ) only).',
    subject: (v) => v.trim().length >= 3 || 'Please enter a subject.',
    message: (v) => v.trim().length >= 10 || 'Message must be at least 10 characters.',
  };

  const validateField = (field) => {
    const rule = validators[field.name];
    const group = field.closest('.form-group');
    if (!group || !rule) return true;

    const result = rule(field.value);
    if (result === true) {
      group.classList.remove('is-error');
      field.removeAttribute('aria-invalid');
      return true;
    }
    group.classList.add('is-error');
    field.setAttribute('aria-invalid', 'true');
    const msg = group.querySelector('.error-msg');
    if (msg) msg.textContent = typeof result === 'string' ? result : 'Invalid value.';
    return false;
  };

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-group').classList.contains('is-error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input, textarea')];
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid || !successBox) return;

    successBox.classList.add('is-visible');
    form.reset();
    setTimeout(() => successBox.classList.remove('is-visible'), 6000);
  });
}

/* ---------- Init on load ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initImageFallbacks();
  initNavbar();
  initMobileMenu();
  setActiveLink();
  initReveal();
  initLightbox();
  initContactForm();
});
