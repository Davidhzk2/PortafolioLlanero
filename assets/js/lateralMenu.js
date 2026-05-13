const menuItems = document.querySelectorAll(".btnSvgSide");
const sections = document.querySelectorAll(".section");


// CLICK SUAVE
menuItems.forEach(item => {

    const link = item.querySelector("a");

    link.addEventListener("click", (e) => {

        e.preventDefault();

        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


// SCROLL ACTIVE
const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const activeId = entry.target.id;

            menuItems.forEach(item => {

                item.classList.remove("active");

                const link = item.querySelector("a");

                if (link.getAttribute("href") === `#${activeId}`) {
                    item.classList.add("active");
                }

            });

        }

    });

}, {
    threshold: 0.7
});


// OBSERVAR SECCIONES
sections.forEach(section => {
    observer.observe(section);
});