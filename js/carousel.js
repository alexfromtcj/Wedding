(function () {
  var AUTOPLAY_MS = 5000;
  var SWIPE_THRESHOLD = 40;
  var RESIZE_DEBOUNCE_MS = 150;

  var carousels = document.querySelectorAll('[data-carousel]');

  carousels.forEach(function (carousel) {
    var track  = carousel.querySelector('.carousel-track');
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    var dotsEl = carousel.querySelector('.carousel-dots');
    var prevBtn = carousel.querySelector('.carousel-arrow-prev');
    var nextBtn = carousel.querySelector('.carousel-arrow-next');
    var progressFill = carousel.parentElement
      ? carousel.parentElement.querySelector('.carousel-progress-bar-fill')
      : null;

    if (!track || slides.length === 0) return;

    var current = 0;
    var dots = [];
    var itemsPerView = 1;
    var maxIndex = 0;
    var autoplayTimer = null;
    var hovering = false;
    var pointerDown = false;
    var startX = 0;
    var deltaX = 0;
    var resizeTimer = null;

    function readItemsPerView() {
      var raw = getComputedStyle(carousel).getPropertyValue('--carousel-items');
      var n = parseInt(raw, 10);
      return n > 0 ? n : 1;
    }

    function buildDots() {
      dotsEl.innerHTML = '';
      dots = [];
      var total = maxIndex + 1;
      for (var i = 0; i < total; i++) {
        (function (i) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'carousel-dot';
          dot.setAttribute('role', 'tab');
          dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
          dot.addEventListener('click', function () {
            goTo(i);
            restartAutoplay();
          });
          dotsEl.appendChild(dot);
          dots.push(dot);
        })(i);
      }
    }

    function update() {
      var slidePercent = 100 / itemsPerView;
      track.style.transform = 'translateX(-' + (current * slidePercent) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-selected', String(i === current));
      });

      if (progressFill) {
        var total = maxIndex + 1;
        var progress = total > 1 ? (current / (total - 1)) * 100 : 100;
        progressFill.style.width = progress + '%';
      }
    }

    function goTo(index) {
      var total = maxIndex + 1;
      current = ((index % total) + total) % total;
      update();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      stopAutoplay();
      if (hovering) return;
      autoplayTimer = window.setInterval(next, AUTOPLAY_MS);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function restartAutoplay() {
      startAutoplay();
    }

    function recalculate() {
      var newItemsPerView = readItemsPerView();
      if (newItemsPerView === itemsPerView && dots.length) return;
      itemsPerView = newItemsPerView;
      maxIndex = Math.max(0, slides.length - itemsPerView);
      if (current > maxIndex) current = maxIndex;
      buildDots();
      update();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        next();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prev();
        restartAutoplay();
      });
    }

    carousel.addEventListener('mouseenter', function () {
      hovering = true;
      stopAutoplay();
    });

    carousel.addEventListener('mouseleave', function () {
      hovering = false;
      startAutoplay();
    });

    track.addEventListener('touchstart', function (e) {
      pointerDown = true;
      startX = e.touches[0].clientX;
      deltaX = 0;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      if (!pointerDown) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });

    track.addEventListener('touchend', function () {
      if (!pointerDown) return;
      pointerDown = false;
      if (deltaX > SWIPE_THRESHOLD) {
        prev();
      } else if (deltaX < -SWIPE_THRESHOLD) {
        next();
      }
      deltaX = 0;
      startAutoplay();
    });

    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(recalculate, RESIZE_DEBOUNCE_MS);
    });

    recalculate();
    startAutoplay();
  });
})();
