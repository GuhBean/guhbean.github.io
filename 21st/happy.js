(function () {
  function disableDevTools() {
    // Disable right-click
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    // Disable common devtools shortcuts
    document.addEventListener('keydown', function (e) {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
      }
    });

    // Debugger trick to pause if devtools is open
    setInterval(function(){
      (function(){}).constructor("debugger")();
    }, 100);
  }

  function showHappy() {
    var el = document.getElementById('happy');
    if (el) el.classList.add('visible');
  }

  function setupHoverSwap() {
    var word = document.getElementById('now-word');
    if (!word) return;

    var original = word.textContent;
    var replacement = 'birthday';

    word.addEventListener('mouseenter', function () {
      word.textContent = replacement;
    });

    word.addEventListener('mouseleave', function () {
      word.textContent = original;
    });
  }

  window.addEventListener('load', function () {
    disableDevTools();
    setTimeout(showHappy, 5000);
    setupHoverSwap();
  });
})();