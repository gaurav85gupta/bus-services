/* ==========================================================================
   CITY LAND TRAVELS — script.js
   Modular vanilla JS. Each section below is self-contained and initialised
   from the DOMContentLoaded block once the DOM is ready.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNav();
  initNavActiveLink();
  initHeroParticles();
  initHeroParallax();
  initScrollReveal();
  initCounters();
  initBookingForm();
  initFleetCarousel();
  initSeatMap();
  initTestimonialCarousel();
  initAccordion();
  initNewsletter();
  initButtonRipple();
  initScrollHint();
  initCursorFX();
  initMagneticButtons();
  initTiltCards();
  injectRuntimeStyles();
});

/* ==========================================================================
   1. PRELOADER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hide = () => {
    preloader.classList.add('is-hidden');
    setTimeout(() => preloader.remove(), 600);
  };

  if (document.readyState === 'complete') {
    setTimeout(hide, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 300));
    // Safety net in case 'load' never fires (slow third-party assets etc.)
    setTimeout(hide, 2200);
  }
}

/* ==========================================================================
   2. STICKY / GLASS NAVIGATION + MOBILE MENU
   ========================================================================== */
function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (burger && mobileMenu) {
    const menuLinks = mobileMenu.querySelectorAll('.mobile-menu__links a');
    // Stagger the reveal of each link when the menu opens
    menuLinks.forEach((link, i) => {
      link.style.setProperty('--menu-d', `${0.12 + i * 0.06}s`);
    });

    const openMenu = () => {
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    };

    burger.addEventListener('click', () => {
      const isOpen = burger.classList.contains('is-open');
      if (isOpen) closeMenu(); else openMenu();
    });

    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
    if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    mobileMenu.querySelectorAll('.mobile-menu__actions a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.classList.contains('is-open')) closeMenu();
    });

    // Close the menu automatically if the viewport grows back into desktop size
    // (must match the 992px breakpoint where CSS switches the nav back to the
    // full inline links / actions layout, or the scroll-lock + aria state can
    // get stuck open behind a nav that's no longer rendering the hamburger).
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && burger.classList.contains('is-open')) closeMenu();
    });
  }
}

/* ==========================================================================
   2b. NAV — ACTIVE LINK ON SCROLL
   Highlights whichever section link matches the section currently in view.
   ========================================================================== */
function initNavActiveLink() {
  const links = document.querySelectorAll('.nav__links a[href^="#"], .mobile-menu__links a[href^="#"]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  const sections = [...links]
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   3. HERO — FLOATING PARTICLES
   ========================================================================== */
function initHeroParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const COUNT = window.innerWidth < 768 ? 14 : 28;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < COUNT; i++) {
    const span = document.createElement('span');
    const left = Math.random() * 100;
    const size = 2 + Math.random() * 3;
    const duration = 8 + Math.random() * 10;
    const delay = Math.random() * 10;

    span.style.left = `${left}%`;
    span.style.width = `${size}px`;
    span.style.height = `${size}px`;
    span.style.animationDuration = `${duration}s`;
    span.style.animationDelay = `${delay}s`;
    frag.appendChild(span);
  }

  container.appendChild(frag);
}

/* ==========================================================================
   3b. HERO — CURSOR PARALLAX
   Sky, horizon and road drift a few px opposite the pointer for subtle depth.
   ========================================================================== */
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const sky = document.querySelector('.hero__sky');
  const horizon = document.querySelector('.hero__horizon');
  const road = document.querySelector('.hero__road');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 .. 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    if (sky) sky.style.transform = `translate(${px * -14}px, ${py * -8}px) scale(1.03)`;
    if (horizon) horizon.style.transform = `translate(${px * -22}px, 0)`;
    if (road) road.style.transform = `translate(${px * -10}px, 0)`;
  });

  hero.addEventListener('pointerleave', () => {
    if (sky) sky.style.transform = '';
    if (horizon) horizon.style.transform = '';
    if (road) road.style.transform = '';
  });
}

/* ==========================================================================
   4. SCROLL HINT (hero) — fades out once user starts scrolling
   ========================================================================== */
function initScrollHint() {
  const hint = document.getElementById('scrollHint');
  if (!hint) return;

  hint.addEventListener('click', () => {
    const booking = document.getElementById('booking');
    if (booking) booking.scrollIntoView({ behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    hint.classList.toggle('is-hidden', window.scrollY > 120);
  }, { passive: true });
}

/* ==========================================================================
   5. SCROLL REVEAL (IntersectionObserver)
   Handles: .reveal-up, .reveal-left, .reveal-right, .reveal-blur
   Supports optional stagger via inline style="--d: 0.2s"
   ========================================================================== */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-blur'
  );
  if (!targets.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. ANIMATED COUNTERS (trust section)
   Reads data-count / data-suffix / data-decimals from each .trust__num
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.trust__num');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals !== undefined
      ? parseInt(el.dataset.decimals, 10)
      : (Number.isInteger(target) ? 0 : 1);
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    };

    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. BOOKING SEARCH FORM
   Handles: city swap, passenger stepper, date guard rails, submit
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const originInput = document.getElementById('origin');
  const destinationInput = document.getElementById('destination');
  const swapBtn = document.getElementById('swapCities');
  const journeyDate = document.getElementById('journeyDate');
  const returnDate = document.getElementById('returnDate');
  const passDec = document.getElementById('passDec');
  const passInc = document.getElementById('passInc');
  const passCount = document.getElementById('passCount');
  const passengersHidden = document.getElementById('passengers');

  const MIN_PASS = 1;
  const MAX_PASS = 6;

  // --- Swap origin/destination ---
  if (swapBtn && originInput && destinationInput) {
    swapBtn.addEventListener('click', () => {
      const temp = originInput.value;
      originInput.value = destinationInput.value;
      destinationInput.value = temp;
      swapBtn.classList.add('is-spinning');
      setTimeout(() => swapBtn.classList.remove('is-spinning'), 400);
    });
  }

  // --- Date guard rails: journey date can't be in the past,
  //     return date can't be before journey date ---
  const today = new Date().toISOString().split('T')[0];
  if (journeyDate) {
    journeyDate.min = today;
    if (!journeyDate.value) journeyDate.value = today;

    journeyDate.addEventListener('change', () => {
      if (returnDate) returnDate.min = journeyDate.value;
      if (returnDate && returnDate.value && returnDate.value < journeyDate.value) {
        returnDate.value = journeyDate.value;
      }
    });
    if (returnDate) returnDate.min = journeyDate.value || today;
  }

  // --- Passenger stepper ---
  const updatePassengerCount = (delta) => {
    let value = parseInt(passCount.textContent, 10) || 1;
    value = Math.min(MAX_PASS, Math.max(MIN_PASS, value + delta));
    passCount.textContent = value;
    if (passengersHidden) passengersHidden.value = value;

    if (passDec) passDec.disabled = value <= MIN_PASS;
    if (passInc) passInc.disabled = value >= MAX_PASS;
  };

  if (passDec) passDec.addEventListener('click', () => updatePassengerCount(-1));
  if (passInc) passInc.addEventListener('click', () => updatePassengerCount(1));

  // --- Submit ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (
      originInput && destinationInput &&
      originInput.value.trim().toLowerCase() === destinationInput.value.trim().toLowerCase()
    ) {
      shakeElement(form);
      showToast('Origin and destination can\u2019t be the same city.');
      return;
    }

    const submitBtn = form.querySelector('.booking-card__submit');
    if (submitBtn) {
      submitBtn.classList.add('is-loading');
      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        showToast(`Searching buses: ${originInput.value} \u2192 ${destinationInput.value}`);
        document.getElementById('routes')?.scrollIntoView({ behavior: 'smooth' });
      }, 900);
    }
  });
}

/* Small shake animation for invalid form state */
function shakeElement(el) {
  el.style.animation = 'none';
  void el.offsetWidth; // force reflow so the animation can restart
  el.style.animation = 'shakeX 0.4s ease';
  setTimeout(() => { el.style.animation = ''; }, 450);
}

/* Lightweight toast notification, created on demand */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.setAttribute('role', 'status');
    toast.style.cssText = `
      position: fixed; left: 50%; bottom: 32px; transform: translateX(-50%) translateY(20px);
      background: #0A2342; color: #fff; padding: 14px 22px; border-radius: 999px;
      font-family: 'Inter', sans-serif; font-size: 0.92rem; font-weight: 600;
      box-shadow: 0 16px 40px rgba(10,35,66,0.35); z-index: 9999; opacity: 0;
      transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none;
      max-width: 90vw; text-align: center;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2800);
}

/* ==========================================================================
   8. FLEET CAROUSEL
   ========================================================================== */
function initFleetCarousel() {
  const track = document.getElementById('fleetTrack');
  const prevBtn = document.getElementById('fleetPrev');
  const nextBtn = document.getElementById('fleetNext');
  if (!track) return;

  const getScrollStep = () => {
    const card = track.querySelector('.fleet-card');
    if (!card) return 320;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '24');
    return card.getBoundingClientRect().width + gap;
  };

  const updateNavState = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 2;
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll;
  };

  prevBtn?.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
  });
  nextBtn?.addEventListener('click', () => {
    track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', () => {
    clearTimeout(track._navTimer);
    track._navTimer = setTimeout(updateNavState, 60);
  }, { passive: true });

  window.addEventListener('resize', updateNavState);
  updateNavState();
}

/* ==========================================================================
   9. INTERACTIVE SEAT MAP
   Builds a 2+2 coach layout with a center aisle, random pre-booked seats,
   and click-to-select behaviour (max 4 seats).
   ========================================================================== */
function initSeatMap() {
  const busEl = document.getElementById('seatBus');
  const summaryEl = document.getElementById('seatSummary');
  const continueBtn = document.getElementById('seatContinue');
  if (!busEl) return;

  const ROWS = 10;
  const MAX_SELECTABLE = 4;
  const seed = [3, 7, 12, 15, 18, 22, 27, 31, 35];
  const bookedSeats = new Set(seed);
  const selectedSeats = new Set();

  let seatNumber = 1;

  for (let row = 0; row < ROWS; row++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'seatmap__row';

    // Left pair (2 seats)
    for (let i = 0; i < 2; i++) {
      rowEl.appendChild(buildSeat(seatNumber));
      seatNumber++;
    }

    // Aisle
    const aisle = document.createElement('div');
    aisle.className = 'seatmap__aisle';
    rowEl.appendChild(aisle);

    // Right pair (2 seats)
    for (let i = 0; i < 2; i++) {
      rowEl.appendChild(buildSeat(seatNumber));
      seatNumber++;
    }

    busEl.appendChild(rowEl);
  }

  function buildSeat(num) {
    const seat = document.createElement('button');
    seat.type = 'button';
    seat.className = 'seat';
    seat.textContent = num;
    seat.dataset.seat = String(num);

    if (bookedSeats.has(num)) {
      seat.classList.add('seat--booked');
      seat.disabled = true;
      seat.setAttribute('aria-label', `Seat ${num}, already booked`);
    } else {
      seat.classList.add('seat--available');
      seat.setAttribute('aria-label', `Seat ${num}, available`);
      seat.addEventListener('click', () => toggleSeat(seat, num));
    }

    return seat;
  }

  function toggleSeat(seat, num) {
    if (selectedSeats.has(num)) {
      selectedSeats.delete(num);
      seat.classList.remove('seat--selected');
      seat.classList.add('seat--available');
      seat.setAttribute('aria-label', `Seat ${num}, available`);
    } else {
      if (selectedSeats.size >= MAX_SELECTABLE) {
        showToast(`You can select up to ${MAX_SELECTABLE} seats.`);
        shakeElement(seat);
        return;
      }
      selectedSeats.add(num);
      seat.classList.remove('seat--available');
      seat.classList.add('seat--selected');
      seat.setAttribute('aria-label', `Seat ${num}, selected`);
    }
    updateSummary();
  }

  function updateSummary() {
    if (!summaryEl) return;

    if (selectedSeats.size === 0) {
      summaryEl.textContent = `Select up to ${MAX_SELECTABLE} seats to continue.`;
    } else {
      const list = Array.from(selectedSeats).sort((a, b) => a - b).join(', ');
      summaryEl.textContent = `Seat${selectedSeats.size > 1 ? 's' : ''} ${list} selected \u00b7 ${selectedSeats.size}/${MAX_SELECTABLE}`;
    }
  }

  continueBtn?.addEventListener('click', (e) => {
    if (selectedSeats.size === 0) {
      e.preventDefault();
      showToast('Please select at least one seat first.');
      busEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* ==========================================================================
   10. TESTIMONIALS — auto-sliding carousel with pause-on-hover
   ========================================================================== */
function initTestimonialCarousel() {
  const track = document.getElementById('testiTrack');
  if (!track) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const SPEED_PX_PER_SEC = 40;
  let isPaused = false;
  let lastTime = null;

  // Duplicate the cards once so the scroll can loop seamlessly.
  const originalCards = Array.from(track.children);
  originalCards.forEach(card => {
    track.appendChild(card.cloneNode(true));
  });

  const step = (now) => {
    if (lastTime === null) lastTime = now;
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    if (!isPaused) {
      track.scrollLeft += SPEED_PX_PER_SEC * delta;

      const halfWidth = track.scrollWidth / 2;
      if (track.scrollLeft >= halfWidth) {
        track.scrollLeft -= halfWidth;
      }
    }

    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);

  track.addEventListener('mouseenter', () => { isPaused = true; });
  track.addEventListener('mouseleave', () => { isPaused = false; });
  track.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
  track.addEventListener('touchend', () => { isPaused = false; });
}

/* ==========================================================================
   11. FAQ ACCORDION
   ========================================================================== */
function initAccordion() {
  const accordion = document.getElementById('accordion');
  if (!accordion) return;

  const items = accordion.querySelectorAll('.accordion__item');

  items.forEach(item => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items (single-open accordion)
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.accordion__trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ==========================================================================
   12. NEWSLETTER FORM
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value.trim()) return;

    const btn = form.querySelector('button');
    const originalHTML = btn ? btn.innerHTML : '';

    if (btn) {
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    showToast(`Subscribed! Fare drops incoming at ${input.value.trim()}`);
    input.value = '';

    setTimeout(() => {
      if (btn) btn.innerHTML = originalHTML;
    }, 2200);
  });
}

/* ==========================================================================
   13. BUTTON RIPPLE MICRO-INTERACTION
   ========================================================================== */
function initButtonRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      this.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`);
      this.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`);

      this.classList.remove('is-rippling');
      void this.offsetWidth; // force reflow to allow re-triggering on rapid clicks
      this.classList.add('is-rippling');
    });
  });
}

/* ==========================================================================
   15. CURSOR FX — soft ambient glow + custom dot cursor (desktop only)
   Also injects the fixed grain-texture overlay used across dark sections.
   ========================================================================== */
function initCursorFX() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Grain overlay (whole page, extremely low opacity — see .grain in CSS)
  const grain = document.createElement('div');
  grain.className = 'grain';
  document.body.appendChild(grain);

  // Ambient glow, only shown while hovering a dark section
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  const glowSections = document.querySelectorAll('.hero, .amenities, .app, .cta');

  // Custom dot cursor
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let rafId = null;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.classList.add('is-active');

    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      glow.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

      const overDark = [...glowSections].some(sec => {
        const r = sec.getBoundingClientRect();
        return mouseY >= r.top && mouseY <= r.bottom;
      });
      glow.classList.toggle('is-active', overDark);
      rafId = null;
    });
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    dot.classList.remove('is-active');
    glow.classList.remove('is-active');
  });

  const hoverables = document.querySelectorAll('a, button, .seat, input, .accordion__trigger');
  hoverables.forEach(el => {
    el.addEventListener('pointerenter', () => dot.classList.add('is-hovering'));
    el.addEventListener('pointerleave', () => dot.classList.remove('is-hovering'));
  });
}

/* ==========================================================================
   16. MAGNETIC BUTTONS
   Large CTA buttons drift gently toward the cursor within their bounds,
   then spring back on leave (Stripe/Linear-style micro-interaction).
   ========================================================================== */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll('.btn--lg');
  const STRENGTH = 0.25;

  targets.forEach(btn => {
    btn.classList.add('btn--magnetic');

    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      btn.style.setProperty('--mx', `${relX * STRENGTH}px`);
      btn.style.setProperty('--my', `${relY * STRENGTH}px`);
    });

    btn.addEventListener('pointerleave', () => {
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    });
  });
}

/* ==========================================================================
   17. 3D TILT CARDS
   Route and fleet cards tilt toward the cursor on hover for a physical,
   premium feel. Sets --tx/--ty (rotation) consumed by CSS transforms.
   ========================================================================== */
function initTiltCards() {
  if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.route-card, .fleet-card');
  const MAX_DEG = 6;

  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;

      const ry = (px - 0.5) * MAX_DEG * 2;   // rotateY driven by horizontal position
      const rx = (0.5 - py) * MAX_DEG * 2;   // rotateX driven by vertical position

      card.style.setProperty('--ty', `${ry}deg`);
      card.style.setProperty('--tx', `${rx}deg`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--ty', '0deg');
      card.style.setProperty('--tx', '0deg');
    });
  });

  // Why-choose-us cards get a lighter, glow-only treatment (no tilt, just --mx/--my for the radial highlight)
  document.querySelectorAll('.why-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  });
}

/* ==========================================================================
   14. Inject a couple of small runtime styles needed only by JS-driven
       interactions (ripple origin + shake), so style.css stays purely
       declarative for the sections it already owns.
   ========================================================================== */
function injectRuntimeStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .btn::after { left: var(--ripple-x, 50%); top: var(--ripple-y, 50%); }
    @keyframes shakeX {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
    .booking-card__swap.is-spinning svg {
      transition: transform 0.4s var(--ease-out, ease);
      transform: rotate(180deg);
    }
    .booking-card__submit.is-loading { opacity: 0.75; pointer-events: none; }
  `;
  document.head.appendChild(style);
}
