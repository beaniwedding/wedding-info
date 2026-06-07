/**
 * main.js
 * Pure vanilla JS, no external dependencies.
 * Security: No eval(), no innerHTML with user data, no external fetches.
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* 1. NAV: active link highlighting & scroll shadow                     */
  /* ------------------------------------------------------------------ */
  const nav       = document.getElementById('site-nav');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const sections  = document.querySelectorAll('.page-section');
  const navToggle = document.querySelector('.nav-toggle');
  const navList   = document.querySelector('.nav-links');

  // Mobile hamburger toggle
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close on link click
    navList.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navList.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function getActiveSection() {
    const scrollY    = window.scrollY;
    const navH       = nav ? nav.offsetHeight : 72;
    const threshold  = navH + 80;
    let current      = sections[0];

    sections.forEach(function (section) {
      if (section.offsetTop - threshold <= scrollY) {
        current = section;
      }
    });
    return current ? current.id : '';
  }

  function updateNav() {
    const id = getActiveSection();
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ------------------------------------------------------------------ */
  /* 2. HERO SLIDESHOW                                                    */
  /* ------------------------------------------------------------------ */
  const slides    = document.querySelectorAll('.slide');
  const dots      = document.querySelectorAll('.dot');
  const prevBtn   = document.querySelector('.slide-btn.prev');
  const nextBtn   = document.querySelector('.slide-btn.next');
  let current     = 0;
  let timer       = null;
  const INTERVAL  = 6000; // ms between auto-advances

  function goToSlide(idx) {
    if (!slides.length) return;
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startTimer() {
    clearInterval(timer);
    if (slides.length > 1) {
      timer = setInterval(function () { goToSlide(current + 1); }, INTERVAL);
    }
  }

  if (slides.length) {
    slides[0].classList.add('active');
    dots[0] && dots[0].classList.add('active');
    startTimer();

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToSlide(current - 1);
        startTimer();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
        startTimer();
      });
    });

    // Touch / swipe support
    var touchStartX = 0;
    var touchEndX   = 0;
    var hero = document.getElementById('home');
    if (hero) {
      hero.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });
      hero.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].clientX;
        var diff  = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          goToSlide(diff > 0 ? current + 1 : current - 1);
          startTimer();
        }
      }, { passive: true });
    }

    // Pause on hover
    var slideshow = document.querySelector('.slideshow');
    if (slideshow) {
      slideshow.addEventListener('mouseenter', function () { clearInterval(timer); });
      slideshow.addEventListener('mouseleave', startTimer);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 3. SCROLL FADE-IN                                                    */
  /* ------------------------------------------------------------------ */
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: just show everything
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ------------------------------------------------------------------ */
  /* 4. SMOOTH ANCHOR SCROLL (offset for fixed nav)                      */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navH   = nav ? nav.offsetHeight : 72;
      var top    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ------------------------------------------------------------------ */
  /* 5. MAP IFRAME LOAD ERROR DETECTION                                   */
  /* ------------------------------------------------------------------ */
  var mapIframe = document.querySelector('.map-frame iframe');
  var mapPlaceholder = document.querySelector('.map-placeholder');

  // If the iframe fails to load (blocked by CSP or network),
  // show the placeholder text instead.
  if (mapIframe && mapPlaceholder) {
    mapIframe.addEventListener('error', function () {
      mapIframe.style.display      = 'none';
      mapPlaceholder.style.display = 'flex';
    });
  }

})();
