// =======================
// HEADER
// =======================

let lastScroll = 0;

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

  const currentScroll = window.pageYOffset;

  if (currentScroll <= 150) {

    header.classList.remove("header--hidden");

  } else {

    header.classList.add("header--hidden");

  }

  lastScroll = currentScroll;

});


// =======================
// ANIMACIONES PROJECT
// =======================

const elements = document.querySelectorAll(".project");

elements.forEach(el => {

  let state = "idle";
  let pending = null;

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      const shouldBe =
        entry.isIntersecting
          ? "visible"
          : "out";

      if (state !== "idle") {

        pending = shouldBe;

        return;

      }

      runAnimation(shouldBe);

    });

  }, {
    threshold: 0.7
  });

  function runAnimation(type) {

    state =
      type === "visible"
        ? "animating-in"
        : "animating-out";

    el.classList.remove("visible", "out");

    el.classList.add(type);

  }

  el.addEventListener("animationend", () => {

    state = "idle";

    if (pending) {

      const next = pending;

      pending = null;

      if (!el.classList.contains(next)) {

        runAnimation(next);

      }
    }
  });

  observer.observe(el);

});


// =======================
// ROTACIÓN RANDOM ICONOS
// =======================

const items = document.querySelectorAll("#listImg");

items.forEach(img => {

  const rotation = (Math.random() * 130 - 3);

  img.style.transform =
    `rotate(${rotation}deg)`;

});


// =======================
// VIEW TRANSITIONS
// =======================

function applyTransitionName() {

  const currentTransition =
    sessionStorage.getItem("active-transition");

  if (!currentTransition) return;

  const element = document.querySelector(
    `[data-transition-target="${currentTransition}"]`
  );

  if (!element) return;

  // 👇 asignar transición
  element.style.viewTransitionName =
    currentTransition;

  // 👇 cleanup después de registrar
  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      element.style.viewTransitionName = "none";

      sessionStorage.removeItem(
        "active-transition"
      );

    });

  });

}


// =======================
// NAVEGACIÓN ENTRE PÁGINAS
// =======================

document
  .querySelectorAll("a[data-transition]")
  .forEach((link) => {

    link.addEventListener("click", async (e) => {

      e.preventDefault();

      const transitionName =
        link.dataset.transition;

      sessionStorage.setItem(
        "active-transition",
        transitionName
      );

      const element = document.querySelector(
        `[data-transition-target="${transitionName}"]`
      );

      if (element) {

        // 👇 registrar shared element
        element.style.viewTransitionName =
          transitionName;

        // 👇 FORZAR REFLOW REAL
        element.getBoundingClientRect();

      }

      // 👇 pequeño delay para estabilizar
      await new Promise(resolve =>
        setTimeout(resolve, 50)
      );

      // 👇 navegar
      window.location.href = link.href;

    });

  });


// =======================
// INIT
// =======================

applyTransitionName();