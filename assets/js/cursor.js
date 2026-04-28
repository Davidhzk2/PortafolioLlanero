const cursor = document.getElementById("cursor");
const path = document.getElementById("cursor-path");
const trail = document.getElementById("trail");

// =======================
// 🎯 AJUSTE MANUAL DEL TRAIL
// =======================
const TRAIL_OFFSET_X = 13;
const TRAIL_OFFSET_Y = 31;

// valores finales
const NORMAL_DASH = 1277;
const NORMAL_OFFSET = -1282;

const HOVER_DASH = 2308;
const HOVER_OFFSET = 1300;

const HIDDEN_DASH = 1914;
const HIDDEN_OFFSET = -1914;

// estado inicial
path.style.strokeDasharray = NORMAL_DASH;
path.style.strokeDashoffset = NORMAL_OFFSET;

// viewport
trail.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
window.addEventListener("resize", () => {
  trail.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
});

// estados
let isHovering = false;
let isMoving = false;
let lastMoveTime = 0;

// 🔥 cargar posición guardada
const savedX = localStorage.getItem("cursorX");
const savedY = localStorage.getItem("cursorY");

let mouse = {
  x: savedX ? parseFloat(savedX) : window.innerWidth / 2,
  y: savedY ? parseFloat(savedY) : window.innerHeight / 2
};

let pos = { x: mouse.x, y: mouse.y };

let currentTrail = null;
let currentPoints = [];

// 🔥 guardar posición
function saveCursorPosition(x, y) {
  localStorage.setItem("cursorX", x);
  localStorage.setItem("cursorY", y);
}

// 🔥 actualizar cursor
function updateCursorPosition(x, y) {
  mouse.x = x;
  mouse.y = y;

  pos.x = x;
  pos.y = y;

  cursor.style.transform = `translate(${x}px, ${y}px)`;
}

// 🔹 cuando vuelves a la pestaña
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateCursorPosition(mouse.x, mouse.y);
  }
});

// 🔹 cuando el mouse entra
window.addEventListener("mouseenter", (e) => {
  updateCursorPosition(e.clientX, e.clientY);
});

// 🔹 cuando haces click → 🔥 GUARDAMOS POSICIÓN
window.addEventListener("mousedown", (e) => {
  saveCursorPosition(e.clientX, e.clientY);
  updateCursorPosition(e.clientX, e.clientY);
});

// 🔹 fallback al cargar
window.addEventListener("load", () => {
  updateCursorPosition(mouse.x, mouse.y);
});

// hover real
function detectHover(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return false;
  return el.closest("button, a, .header__right");
}

// suavizado
function buildSmoothPath(points) {
  if (points.length < 2) return "";

  let d = `M ${points[0][0]} ${points[0][1]}`;

  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i][0] + points[i + 1][0]) / 2;
    const yc = (points[i][1] + points[i + 1][1]) / 2;
    d += ` Q ${points[i][0]} ${points[i][1]} ${xc} ${yc}`;
  }

  return d;
}

// crear trail
function createTrail() {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
  el.setAttribute("fill", "none");
  el.setAttribute("stroke", "#2C2C2C");
  el.setAttribute("stroke-width", 2);
  trail.appendChild(el);
  return el;
}

// cerrar trail
function finishTrail(trailEl) {
  if (!trailEl) return;

  const len = trailEl.getTotalLength();

  trailEl.setAttribute("stroke-dasharray", len);
  trailEl.setAttribute("stroke-dashoffset", 0);

  requestAnimationFrame(() => {
    trailEl.style.transition = "stroke-dashoffset 0.6s ease";
    trailEl.style.strokeDashoffset = -len;
  });

  setTimeout(() => {
    if (trailEl.parentNode) trail.removeChild(trailEl);
  }, 600);
}

// cursor visual
function applyCursor() {
  if (isHovering) {
    path.style.strokeDasharray = HOVER_DASH;
    path.style.strokeDashoffset = HOVER_OFFSET;
    return;
  }

  if (isMoving) {
    path.style.strokeDasharray = HIDDEN_DASH;
    path.style.strokeDashoffset = HIDDEN_OFFSET;
    return;
  }

  path.style.strokeDasharray = NORMAL_DASH;
  path.style.strokeDashoffset = NORMAL_OFFSET;
}

// movimiento
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  pos.x = mouse.x;
  pos.y = mouse.y;

  const hoveringNow = detectHover(mouse.x, mouse.y);

  if (hoveringNow) {
    if (!isHovering) {
      isHovering = true;

      finishTrail(currentTrail);
      currentTrail = null;

      applyCursor();
    }
    return;
  } else {
    if (isHovering) {
      isHovering = false;
      applyCursor();
    }
  }

  isMoving = true;
  lastMoveTime = performance.now();

  if (!currentTrail) {
    currentTrail = createTrail();
    currentPoints = [];
  }

  currentPoints.push([
    pos.x + TRAIL_OFFSET_X,
    pos.y + TRAIL_OFFSET_Y
  ]);

  if (currentPoints.length > 20) currentPoints.shift();

  const d = buildSmoothPath(currentPoints);
  currentTrail.setAttribute("d", d);

  applyCursor();
});

// animación
function animate(time) {
  cursor.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

  if (!isHovering && isMoving && time - lastMoveTime > 16) {
    isMoving = false;

    if (currentTrail) {
      currentPoints.push([
        mouse.x + TRAIL_OFFSET_X,
        mouse.y + TRAIL_OFFSET_Y
      ]);

      const d = buildSmoothPath(currentPoints);
      currentTrail.setAttribute("d", d);
    }

    finishTrail(currentTrail);
    currentTrail = null;

    applyCursor();
  }

  requestAnimationFrame(animate);
}

animate();