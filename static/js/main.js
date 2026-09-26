/* Lazy video playback + BibTeX copy. No dependencies. */

(function () {
  "use strict";

  var videos = document.querySelectorAll("video[data-src]");

  videos.forEach(function (v) {
    /* Distinguish scroll-triggered pauses from the user pressing pause,
       so a manual pause is not overridden when the video re-enters the viewport. */
    v.addEventListener("pause", function () {
      if (v.dataset.autoPaused) {
        delete v.dataset.autoPaused;
      } else {
        v.dataset.userPaused = "1";
      }
    });
    v.addEventListener("play", function () {
      delete v.dataset.userPaused;
    });
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            if (!v.src) v.src = v.dataset.src;
            if (!v.dataset.userPaused) v.play().catch(function () {});
          } else if (v.src && !v.paused) {
            v.dataset.autoPaused = "1";
            v.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    videos.forEach(function (v) { io.observe(v); });
  } else {
    videos.forEach(function (v) {
      v.src = v.dataset.src;
      v.muted = true;
      v.play().catch(function () {});
    });
  }

  var btn = document.getElementById("copy-bib");
  var code = document.getElementById("bib-code");
  if (btn && code) {
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(code.textContent).then(function () {
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = "Copy"; }, 1600);
      });
    });
  }
})();
