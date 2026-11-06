(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  if (!reduce) {
    window.addEventListener("pointermove", function (event) {
      root.style.setProperty("--mx", (event.clientX / window.innerWidth) * 100 + "%");
      root.style.setProperty("--my", (event.clientY / window.innerHeight) * 100 + "%");
    }, { passive: true });
  }

  var canvas = document.querySelector(".field");
  if (!canvas || reduce) return;

  var ctx = canvas.getContext("2d");
  var points = [];
  var width = 0;
  var height = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function seed() {
    points = [];
    var count = Math.min(70, Math.floor((width * height) / 18000));
    for (var i = 0; i < count; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.fillStyle = "rgba(255, 176, 137, 0.75)";
      ctx.fillRect(p.x, p.y, 1.5, 1.5);
      for (var j = i + 1; j < points.length; j++) {
        var q = points[j];
        var dx = p.x - q.x;
        var dy = p.y - q.y;
        var dist = Math.hypot(dx, dy);
        if (dist < 140) {
          ctx.strokeStyle = "rgba(255, 92, 57, " + (1 - dist / 140) * 0.28 + ")";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }

  resize();
  seed();
  window.addEventListener("resize", function () {
    resize();
    seed();
  });
  frame();
})();
