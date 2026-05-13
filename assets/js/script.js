// =======================
// NAVEGACIÓN ENTRE PÁGINAS
// =======================

// Flag: CSS, fuentes e imágenes están listos
let transitionsReady = false;

window.addEventListener("load", () => {

  // Pequeño buffer para que el browser
  // termine de parsear los @keyframes
  setTimeout(() => {
    transitionsReady = true;
  }, 100);

});

document
  .querySelectorAll("a[data-transition]")
  .forEach((link) => {

    link.addEventListener("click", (e) => {

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

      // Cancela animaciones activas en el botón que disparó el click
      const btn = e.currentTarget.closest(".button__svg");

      if (btn) {
        btn.getAnimations().forEach(a => a.cancel());
      }

      const navigate = () => {

        if (document.startViewTransition && transitionsReady) {

          if (element) {
            element.style.animation = "none";
            element.getBoundingClientRect();
            element.style.viewTransitionName = transitionName;
          }

          // El snapshot se toma ANTES de ejecutar el callback,
          // eliminando la condición de carrera
          document.startViewTransition(() => {
            window.location.href = link.href;
          });

        } else {

          // Fallback: browser sin soporte o recursos aún cargando
          if (element) {
            element.style.animation = "none";
            element.getBoundingClientRect();
            element.style.viewTransitionName = transitionName;
            element.getBoundingClientRect();
          }

          window.location.href = link.href;

        }

      };

      // Si la página ya está lista, navegar de inmediato.
      // Si no, esperar al load y navegar después.
      // { once: true } evita que se acumulen navegaciones
      // si el usuario hace click varias veces antes de que cargue.
      if (transitionsReady) {
        navigate();
      } else {
        window.addEventListener("load", () => {
          setTimeout(navigate, 100);
        }, { once: true });
      }

    });

  });


// =======================
// INIT
// =======================

applyTransitionName();

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

  element.style.viewTransitionName =
    currentTransition;

  const cleanup = () => {
    element.style.viewTransitionName = "none";
    sessionStorage.removeItem("active-transition");
  };

  // Limpiar cuando la animación de entrada termine
  document.addEventListener(
    "transitionend",
    cleanup,
    { once: true }
  );

  // Fallback: limpiar igual si transitionend no dispara.
  // Debe coincidir con la duración máxima de tu fadeIn/fadeOut
  setTimeout(cleanup, 2000);

}


