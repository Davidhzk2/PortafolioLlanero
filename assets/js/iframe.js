window.addEventListener("load", () => {

  // Esperar a que termine la View Transition
  setTimeout(() => {

    const containers = document.querySelectorAll(
      ".dynamic-iframe"
    );

    containers.forEach((container) => {

      // Evitar duplicados
      if (container.querySelector("iframe")) return;

      const iframe = document.createElement("iframe");

      iframe.src = container.dataset.src;

      iframe.width =
        container.dataset.width || "100%";

      iframe.height =
        container.dataset.height || "100%";

      iframe.style.border = "none";

      iframe.loading = "lazy";

      iframe.allowFullscreen = true;

      iframe.setAttribute(
        "sandbox",
        `
        allow-same-origin
        allow-scripts
        allow-pointer-lock
        allow-forms
        allow-popups
        allow-popups-to-escape-sandbox
        `
      );

      container.appendChild(iframe);

    });

  }, 500);

});