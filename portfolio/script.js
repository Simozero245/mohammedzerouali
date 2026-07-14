/* =========================================================
   Mohamed Zerouali — portfolio
   Clock, sticky-header hairline, scroll reveal, and the
   mouse parallax on the hero collage.
   ========================================================= */

(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- sticky header hairline ---------- */

  var header = document.querySelector('.top');

  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- hero collage parallax ---------- */

  var stage = document.querySelector('[data-parallax]');

  if (stage && !reduced && window.matchMedia('(min-width: 1000px)').matches) {
    var layers = stage.querySelectorAll('[data-depth]');
    var pending = false;
    var mx = 0;
    var my = 0;

    var render = function () {
      pending = false;
      layers.forEach(function (layer) {
        var depth = Number(layer.dataset.depth) / 100;
        layer.style.setProperty('--px', (mx * depth).toFixed(1) + 'px');
        layer.style.setProperty('--py', (my * depth).toFixed(1) + 'px');
      });
    };

    window.addEventListener('mousemove', function (e) {
      // offset from the centre of the viewport, so the collage leans
      // toward the cursor rather than jumping to it
      mx = e.clientX - window.innerWidth / 2;
      my = e.clientY - window.innerHeight / 2;

      if (!pending) {
        pending = true;
        requestAnimationFrame(render);
      }
    }, { passive: true });
  }

  /* ---------- scroll reveal ---------- */

  var targets = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
