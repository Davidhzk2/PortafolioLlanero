const ctas = document.querySelectorAll(".button__svg");


ctas.forEach( cta => {
    cta.addEventListener("mouseenter", () => {
      cta.classList.add("button__svg--hover");
    });
})