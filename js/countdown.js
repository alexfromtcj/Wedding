(function () {
  // July 31, 2027 — ceremony begins 4:00 PM CDT (UTC-5)
  var wedding = new Date('2027-07-31T16:00:00-05:00');

  var els = {
    days:    document.getElementById('days'),
    hours:   document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
  };

  if (!els.days) return;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    var now  = new Date();
    var diff = wedding - now;

    if (diff <= 0) {
      els.days.textContent    = '00';
      els.hours.textContent   = '00';
      els.minutes.textContent = '00';
      els.seconds.textContent = '00';
      clearInterval(timer);
      return;
    }

    els.days.textContent    = pad(Math.floor(diff / 864e5));
    els.hours.textContent   = pad(Math.floor((diff % 864e5) / 36e5));
    els.minutes.textContent = pad(Math.floor((diff % 36e5) / 6e4));
    els.seconds.textContent = pad(Math.floor((diff % 6e4) / 1000));
  }

  tick();
  var timer = setInterval(tick, 1000);
})();
