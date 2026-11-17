/* =========================================================
   Muhammad Shahud - Portfolio
   Vanilla JS for most features; jQuery only for smooth
   anchor scrolling (with navbar offset).
   ========================================================= */

(function () {
  'use strict';

  var nav = document.getElementById('mainNav');
  var backToTop = document.getElementById('backToTop');

  // ---------- Footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Navbar background + back-to-top on scroll ----------
  // ---------- Active nav link (own scroll-spy, replaces Bootstrap's) ----------
  // A section becomes "current" once its top passes a line just below the navbar.
  // Anchor clicks scroll to (section top - 70px), so that always lands past the line.
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('#navMenu a[href^="#"]'));
  var spySections = spyLinks.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  });

  function updateActiveLink() {
    var line = nav.offsetHeight + 80;
    var current = 0;
    spySections.forEach(function (section, i) {
      if (section && section.getBoundingClientRect().top <= line) current = i;
    });
    // At the very bottom of the page, the last section (Contact) wins
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = spySections.length - 1;
    }
    spyLinks.forEach(function (link, i) {
      var isCurrent = i === current;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('scrolled', y > 30);
    backToTop.classList.toggle('show', y > 600);
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  window.addEventListener('load', updateActiveLink);
  onScroll();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Close mobile menu after choosing a link ----------
  var navMenu = document.getElementById('navMenu');
  document.querySelectorAll('#navMenu a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });
  });

  // ---------- Reveal-on-scroll (subtle) ----------
  var revealEls = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

})();

// ---------- jQuery: smooth anchor scrolling with navbar offset ----------
if (window.jQuery) {
  jQuery(function ($) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    $('a[href^="#"]').on('click', function (e) {
      var hash = this.hash;
      if (!hash || hash === '#') return;
      var $target = $(hash);
      if (!$target.length) return;

      e.preventDefault();
      var top = $target.offset().top - 70;
      $('html, body').stop().animate({ scrollTop: top }, reduce ? 0 : 600, function () {
        history.replaceState(null, '', hash);
        // Move keyboard focus to the section for accessibility
        $target.attr('tabindex', '-1').trigger('focus');
      });
    });
  });
}
