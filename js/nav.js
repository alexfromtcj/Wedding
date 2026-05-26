(function () {
  var nav       = document.querySelector('.site-nav');
  var hamburger = document.querySelector('.nav-hamburger');
  var menu      = document.querySelector('.nav-menu');

  if (!nav) return;

  // On inner pages (no .hero), always show solid nav
  function onScroll() {
    if (!document.querySelector('.hero') || window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && menu) {
    hamburger.addEventListener('click', function () {
      var open = menu.classList.toggle('active');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) {
        menu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        menu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Highlight active nav link
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-menu a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').replace(/\/$/, '');
    if (href && path.endsWith(href)) {
      link.classList.add('active');
    }
  });
})();
