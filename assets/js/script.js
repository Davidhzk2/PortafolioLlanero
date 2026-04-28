let lastScroll = 0;
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 150) {
    // 👇 SOLO aparece en el top
    header.classList.remove("header--hidden");
  } else {
    // 👇 cualquier otro punto → oculto
    header.classList.add("header--hidden");
  }

  lastScroll = currentScroll;
});

/*const elements = document.querySelectorAll("#project");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.7 // 👈 se activa cuando el 30% es visible
});

elements.forEach(el => observer.observe(el));*/

const elements = document.querySelectorAll(".project");

elements.forEach(el => {
  let state = "idle"; // idle | animating-in | animating-out
  let pending = null; // "in" | "out"

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const shouldBe = entry.isIntersecting ? "visible" : "out";

      // 👇 Si está animando, guardamos intención
      if (state !== "idle") {
        pending = shouldBe;
        return;
      }

      runAnimation(shouldBe);
    });
  }, { threshold: 0.7 });

  function runAnimation(type) {
    state = type === "visible" ? "animating-in" : "animating-out";

    el.classList.remove("visible", "out");
    el.classList.add(type);
  }

  el.addEventListener("animationend", () => {
    state = "idle";

    // 👇 Si hay algo pendiente, ejecutarlo
    if (pending) {
      const next = pending;
      pending = null;

      // evitar repetir la misma animación
      if (!el.classList.contains(next)) {
        runAnimation(next);
      }
    }
  });

  observer.observe(el);
});

// Código para rotar los iconos de lista

const items = document.querySelectorAll("#listImg");

items.forEach(img => {
  const rotation = (Math.random() * 130 - 3); // entre -5 y 5
  img.style.transform = `rotate(${rotation}deg)`;
});
