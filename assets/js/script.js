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

