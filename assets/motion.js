(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  if (reduce || !fine) return;

  var root = document.documentElement;
  var stage = document.querySelector(".stage");
  var targetX = window.innerWidth * 0.8;
  var targetY = window.innerHeight * 0.12;
  var currentX = targetX;
  var currentY = targetY;
  var shiftX = 0;
  var shiftY = 0;
  var currentShiftX = 0;
  var currentShiftY = 0;

  window.addEventListener("pointermove", function (event) {
    targetX = event.clientX;
    targetY = event.clientY;
    shiftX = (event.clientX / window.innerWidth - 0.5) * 28;
    shiftY = (event.clientY / window.innerHeight - 0.5) * 18;
  }, { passive: true });

  document.querySelectorAll("nav a").forEach(function (link) {
    link.addEventListener("pointermove", function (event) {
      var rect = link.getBoundingClientRect();
      var dx = (event.clientX - rect.left) / rect.width - 0.5;
      var dy = (event.clientY - rect.top) / rect.height - 0.5;
      link.style.setProperty("--x", (event.clientX - rect.left) + "px");
      link.style.setProperty("--y", (event.clientY - rect.top) + "px");
      link.style.transform = "translate(" + (dx * 8) + "px," + (dy * 5) + "px)";
    });
    link.addEventListener("pointerleave", function () {
      link.style.transform = "";
    });
  });

  function frame() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    currentShiftX += (shiftX - currentShiftX) * 0.08;
    currentShiftY += (shiftY - currentShiftY) * 0.08;
    root.style.setProperty("--px", currentX + "px");
    root.style.setProperty("--py", currentY + "px");
    if (stage) {
      stage.style.transform = "translate(" + currentShiftX + "px," + currentShiftY + "px)";
    }
    requestAnimationFrame(frame);
  }

  frame();
})();
