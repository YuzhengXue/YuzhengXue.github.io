const canvas = document.querySelector("#research-canvas");
const context = canvas.getContext("2d");
const year = document.querySelector("#year");
const revealSections = document.querySelectorAll(".section");

year.textContent = new Date().getFullYear();

const palette = ["#c98f92", "#b8a2a7", "#9aa68f", "#b9927d"];
const nodes = Array.from({ length: 30 }, (_, index) => ({
  x: Math.random(),
  y: Math.random(),
  radius: 3 + Math.random() * 5,
  color: palette[index % palette.length],
  drift: 0.0015 + Math.random() * 0.0025,
  phase: Math.random() * Math.PI * 2,
}));

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);
}

function draw(time = 0) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(255, 250, 245, 0.9)";
  context.fillRect(0, 0, width, height);

  const points = nodes.map((node) => {
    const wobble = Math.sin(time * node.drift + node.phase);
    return {
      x: node.x * width + wobble * 18,
      y: node.y * height + Math.cos(time * node.drift + node.phase) * 18,
      radius: node.radius,
      color: node.color,
    };
  });

  points.forEach((point, index) => {
    points.slice(index + 1).forEach((other) => {
      const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < 165) {
        context.strokeStyle = `rgba(108, 82, 78, ${0.14 - distance / 1300})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    });
  });

  points.forEach((point) => {
    context.fillStyle = point.color;
    context.beginPath();
    context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(draw);
}

resizeCanvas();
draw();
window.addEventListener("resize", resizeCanvas);

if ("IntersectionObserver" in window) {
  revealSections.forEach((section) => section.classList.add("reveal-section"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.18,
      rootMargin: "0px 0px -80px 0px",
    },
  );

  revealSections.forEach((section) => revealObserver.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add("is-visible"));
}
