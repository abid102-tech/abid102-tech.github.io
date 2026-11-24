/**
 * Abid Islam Khalid — Portfolio interactions (vanilla JS, no dependencies)
 *
 * Modules:
 *  1. Theme toggle (dark default, persisted in localStorage)
 *  2. Header: scrolled state, mobile menu, active-section highlighting
 *  3. Hero rotating titles
 *  4. Scroll-reveal animations
 *  5. Stat counters
 *  6. Project card spotlight
 *  7. Contact form (Formspree with mailto fallback)
 *  8. Footer year
 *
 * Every module respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------ */
  /* 1. THEME TOGGLE                                                     */
  /* ------------------------------------------------------------------ */
  var themeBtn = document.querySelector('.theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 2. HEADER & NAVIGATION                                              */
  /* ------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('nav-links');
  var desktopNav = window.matchMedia('(min-width: 1024px)');

  // Add a frosted background once the user scrolls past the top.
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  requestAnimationFrame(onScroll); // defer first read to avoid a forced layout during load
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navLinks.classList.toggle('is-open', open);
    if (open && header) header.classList.add('is-scrolled');
    else onScroll();
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close after choosing a link (mobile)
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    // Close with Escape and return focus to the toggle
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        navToggle.focus();
      }
    });

    // Close when clicking outside the menu
    document.addEventListener('click', function (e) {
      if (navToggle.getAttribute('aria-expanded') === 'true' && !e.target.closest('.nav')) setMenu(false);
    });

    // Reset when resizing to desktop
    desktopNav.addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  // Highlight the nav link for the section currently in view.
  var linkMap = {};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) {
    linkMap[a.getAttribute('href').slice(1)] = a;
  });

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(linkMap).forEach(function (id) {
          var active = id === entry.target.id;
          linkMap[id].classList.toggle('is-active', active);
          if (active) linkMap[id].setAttribute('aria-current', 'true');
          else linkMap[id].removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ------------------------------------------------------------------ */
  /* 3. HERO ROTATING TITLES                                             */
  /* ------------------------------------------------------------------ */
  var rotator = document.querySelector('.rotator');
  if (rotator) {
    var words = (rotator.getAttribute('data-words') || '').split('|').filter(Boolean);
    var idx = 0;
    var timer = null;

    function nextWord() {
      idx = (idx + 1) % words.length;
      if (reduceMotion.matches) {
        rotator.textContent = words[idx];
        return;
      }
      rotator.classList.add('is-out');
      setTimeout(function () {
        rotator.textContent = words[idx];
        rotator.classList.remove('is-out');
      }, 350);
    }

    function start() { if (!timer && words.length > 1) timer = setInterval(nextWord, 2600); }
    function stop() { clearInterval(timer); timer = null; }

    start();
    // Pause when the tab is hidden to save CPU/battery
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  }

  /* ------------------------------------------------------------------ */
  /* 4. SCROLL REVEAL                                                    */
  /* ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');

  // Stagger siblings inside grids for a polished cascade
  revealEls.forEach(function (el) {
    var parent = el.parentElement;
    if (!parent) return;
    var siblings = Array.prototype.filter.call(parent.children, function (c) { return c.classList.contains('reveal'); });
    var i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--reveal-delay', Math.min(i, 6) * 80 + 'ms');
  });

  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /* 5. STAT COUNTERS                                                    */
  /* ------------------------------------------------------------------ */
  var counters = document.querySelectorAll('.stat-num[data-count]');

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var duration = 1400;
    var startTime = null;

    function tick(now) {
      if (!startTime) startTime = now;
      var p = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length && 'IntersectionObserver' in window && !reduceMotion.matches) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { countObserver.observe(c); });
  }

  /* ------------------------------------------------------------------ */
  /* 6. PROJECT CARD SPOTLIGHT (pointer devices only)                    */
  /* ------------------------------------------------------------------ */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 7. CONTACT FORM                                                     */
  /* ------------------------------------------------------------------ */
  var form = document.querySelector('.contact-form');
  if (form) {
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var btnLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setStatus(msg, type) {
      statusEl.textContent = msg;
      statusEl.className = 'form-status' + (type ? ' is-' + type : '');
    }

    function setError(field, msg) {
      var err = document.getElementById(field.id + '-err');
      if (msg) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', field.id + '-err');
      } else {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
      }
      if (err) err.textContent = msg || '';
    }

    function validate() {
      var ok = true;
      var name = form.elements.name;
      var email = form.elements.email;
      var message = form.elements.message;

      if (!name.value.trim()) { setError(name, 'Please enter your name.'); ok = false; } else setError(name);
      if (!emailRe.test(email.value.trim())) { setError(email, 'Please enter a valid email address.'); ok = false; } else setError(email);
      if (message.value.trim().length < 10) { setError(message, 'Please write at least 10 characters.'); ok = false; } else setError(message);

      if (!ok) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
      }
      return ok;
    }

    // Clear a field's error as soon as the user fixes it
    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') setError(e.target);
    });

    function mailtoFallback() {
      var to = form.getAttribute('data-mailto');
      var subject = encodeURIComponent('Portfolio contact from ' + form.elements.name.value.trim());
      var body = encodeURIComponent(form.elements.message.value.trim() + '\n\n— ' + form.elements.name.value.trim() + ' (' + form.elements.email.value.trim() + ')');
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
      setStatus('Opening your email app…', 'success');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setStatus('');
      if (!validate()) return;
      if (form.elements._gotcha && form.elements._gotcha.value) return; // bot

      var action = form.getAttribute('action') || '';
      // Formspree not configured yet → use mailto
      if (action.indexOf('YOUR_FORM_ID') !== -1 || !window.fetch) {
        mailtoFallback();
        return;
      }

      submitBtn.disabled = true;
      if (btnLabel) btnLabel.textContent = 'Sending…';

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          setStatus('Thanks! Your message has been sent — I\u2019ll get back to you soon.', 'success');
        })
        .catch(function () {
          setStatus('Something went wrong. Opening your email app instead…', 'error');
          setTimeout(mailtoFallback, 900);
        })
        .finally(function () {
          submitBtn.disabled = false;
          if (btnLabel) btnLabel.textContent = 'Send message';
        });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 8. FOOTER YEAR                                                      */
  /* ------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
