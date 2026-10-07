document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Simple project filter on projects.html
  var filterButtons = document.querySelectorAll('.filter-row button');
  var cards = document.querySelectorAll('.project-card');
  if (filterButtons.length && cards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        cards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  // Scroll reveal: fade + rise elements into view
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  // Header gains a shadow once the page scrolls
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Home page slideshow: auto-advance, arrows, dots, pause on hover/focus
  var slideshow = document.querySelector('.slideshow');
  if (slideshow) {
    var slides = Array.prototype.slice.call(slideshow.querySelectorAll('.slide'));
    var dots = Array.prototype.slice.call(slideshow.querySelectorAll('.slide-dot'));
    var prevBtn = slideshow.querySelector('.slide-prev');
    var nextBtn = slideshow.querySelector('.slide-next');
    var interval = parseInt(slideshow.getAttribute('data-interval'), 10) || 12000;
    var current = 0;
    var timer = null;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current] && dots[current].classList.remove('is-active');
      dots[current] && dots[current].setAttribute('aria-selected', 'false');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current] && dots[current].classList.add('is-active');
      dots[current] && dots[current].setAttribute('aria-selected', 'true');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function start() {
      if (reducedMotion) return;
      stop();
      timer = setInterval(next, interval);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); start(); });
    });

    slideshow.addEventListener('mouseenter', stop);
    slideshow.addEventListener('mouseleave', start);
    slideshow.addEventListener('focusin', stop);
    slideshow.addEventListener('focusout', start);

    start();
  }

  // Contact form: front-end only, prevents actual submission in this preview
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-submit-note');
      if (note) {
        note.textContent = 'Thanks — this demo form isn\u2019t wired to send yet. Connect it to your email or CRM to go live.';
        note.style.color = '#2E6F9E';
      }
    });
  }
});