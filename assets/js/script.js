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

const elements = document.querySelectorAll("#project");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }

    else {
      entry.target.classList.remove("visible");
    }
  });
}, {
  threshold: 0.3 // 👈 se activa cuando el 30% es visible
});

elements.forEach(el => observer.observe(el));

