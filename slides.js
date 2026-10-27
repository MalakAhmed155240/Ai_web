/* ============================================================
   عرض «محاطون بالحمقى» — slides.js
   التنقل: الأسهم + المسافة | أزرار للجوال | سحب الإصبع
   الشرائح تتحرك أفقيًا من اليمين إلى اليسار (RTL)
   ============================================================ */
(function () {
  "use strict";

  var slides   = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var total    = slides.length;
  var numEl    = document.getElementById("counterNum");
  var totalEl  = document.getElementById("counterTotal");
  var bar      = document.getElementById("progressBar");
  var btnPrev  = document.getElementById("btnPrev");
  var btnNext  = document.getElementById("btnNext");

  /* الصفحة تتحرك من اليمين إلى اليسار (عربي):
     السهم الأيسر = التالي، والسهم الأيمن = السابق.
     لقلب ذلك، بدّل العنصرين في القائمتين التاليتين. */
  var FORWARD_KEYS = ["ArrowLeft", "PageDown"];
  var BACK_KEYS    = ["ArrowRight", "PageUp"];

  var current = 0;
  for (var i = 0; i < slides.length; i++) {
    if (slides[i].classList.contains("is-active")) { current = i; break; }
  }

  function render() {
    slides.forEach(function (s, i) {
      var active = i === current;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-hidden", active ? "false" : "true");
    });
    numEl.textContent   = current + 1;
    totalEl.textContent = total;
    bar.style.width     = ((current + 1) / total) * 100 + "%";
    btnPrev.disabled    = current === 0;
    btnNext.disabled    = current === total - 1;
  }

  function goTo(i) {
    current = Math.max(0, Math.min(total - 1, i));
    render();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* لوحة المفاتيح */
  document.addEventListener("keydown", function (e) {
    var k = e.key;
    if (k === " " || k === "Spacebar" || FORWARD_KEYS.indexOf(k) !== -1) {
      e.preventDefault(); next();
    } else if (BACK_KEYS.indexOf(k) !== -1) {
      e.preventDefault(); prev();
    } else if (k === "Home") {
      e.preventDefault(); goTo(0);
    } else if (k === "End") {
      e.preventDefault(); goTo(total - 1);
    }
  });

  /* أزرار الشاشة (للجوال) */
  btnNext.addEventListener("click", function () { next(); btnNext.blur(); });
  btnPrev.addEventListener("click", function () { prev(); btnPrev.blur(); });

  /* سحب الإصبع: في RTL تقع الشريحة التالية جهة اليسار، فيُسحب
     المحتوى يمينًا لكشفها — أي: سحب لليمين = التالي. */
  var sx = null, sy = null;
  window.addEventListener("touchstart", function (e) {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) { next(); } else { prev(); }
    }
    sx = null;
  }, { passive: true });

  render();
})();
