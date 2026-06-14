/* Jared Alexander Masters — interactions
   1) Scroll-reveal (IntersectionObserver)
   2) Click-to-play video facades (poster -> iframe with sound)
   3) Hero background video, gated for desktop + motion-OK + not data-saver
   All progressive: with JS off, posters and content still work. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = navigator.connection && navigator.connection.saveData;

  /* ---------- 1) Scroll reveal ---------- */
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2) Click-to-play facades ---------- */
  function playFacade(el) {
    if (el.classList.contains("is-playing")) return;
    var src = el.getAttribute("data-src");
    if (!src) return;
    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = el.getAttribute("data-title") || "";
    iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture; encrypted-media");
    iframe.setAttribute("allowfullscreen", "");
    iframe.loading = "eager";
    el.classList.add("is-playing");
    el.innerHTML = "";
    el.appendChild(iframe);
  }
  [].slice.call(document.querySelectorAll(".facade")).forEach(function (el) {
    el.addEventListener("click", function () { playFacade(el); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); playFacade(el); }
    });
  });

  /* ---------- 2b) Carousels (testimonials + case studies), with dots ---------- */
  [].slice.call(document.querySelectorAll("[data-carousel]")).forEach(function (car) {
    var track = car.querySelector("[data-carousel-track]");
    if (!track) return;
    var prev = car.querySelector(".carousel__nav--prev");
    var next = car.querySelector(".carousel__nav--next");
    var group = car.querySelector(".carousel__nav-group");
    var slides = [].slice.call(track.children);
    var dots = [].slice.call(car.querySelectorAll(".carousel__dot"));
    function stride() { return slides.length > 1 ? (slides[1].offsetLeft - slides[0].offsetLeft) : track.clientWidth; }
    function step() {
      var item = track.querySelector(".carousel__item");
      return item ? item.getBoundingClientRect().width + 21 : track.clientWidth * 0.9;
    }
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { track.scrollTo({ left: slides[i].offsetLeft, behavior: "smooth" }); });
    });
    function sync() {
      if (group) group.style.visibility = (track.scrollWidth > track.clientWidth + 2) ? "" : "hidden";
      if (dots.length) {
        var idx = Math.max(0, Math.min(dots.length - 1, Math.round(track.scrollLeft / stride())));
        dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
      }
    }
    sync();
    track.addEventListener("scroll", function () { window.requestAnimationFrame(sync); });
    window.addEventListener("resize", sync);
  });

  /* ---------- 2c) Show more work ---------- */
  var moreBtn = document.querySelector("[data-show-more]");
  var workGrid = document.querySelector("[data-work-grid]");
  if (moreBtn && workGrid) {
    moreBtn.addEventListener("click", function () {
      var expanded = workGrid.classList.toggle("is-expanded");
      moreBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
      moreBtn.textContent = expanded ? "Show less" : "Show more work";
      if (expanded) {
        [].slice.call(workGrid.querySelectorAll(".work--more")).forEach(function (el) { el.classList.add("in"); });
      }
    });
  }

  /* ---------- 3) Hero background video ---------- */
  var heroBg = document.querySelector(".hero__bg");
  if (heroBg) {
    var src = heroBg.getAttribute("data-video");
    var bigEnough = window.matchMedia("(min-width: 760px)").matches;
    if (src && bigEnough && !reduceMotion && !saveData) {
      var iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = "";
      iframe.tabIndex = -1;
      iframe.setAttribute("aria-hidden", "true");
      iframe.setAttribute("allow", "autoplay; fullscreen");
      iframe.addEventListener("load", function () { heroBg.classList.add("is-ready"); });
      heroBg.appendChild(iframe);
    }
  }
})();
