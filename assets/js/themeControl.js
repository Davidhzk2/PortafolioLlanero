const btnTheme = document.querySelector(".lightDark");
const body = document.body;
const footer = document.getElementsByTagName("footer")[0];

let defaultTheme = "light";

window.addEventListener('DOMContentLoaded', () => {
    const currentTheme = localStorage.getItem("theme") || defaultTheme;
    if (currentTheme === "dark") {
        body.classList.add("dark");
        footer.classList.add("dark");
    } else {
        body.classList.remove("dark");
        footer.classList.remove("dark");
    }
});

btnTheme.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme") || defaultTheme;
    if (currentTheme === "light") {
        localStorage.setItem("theme", "dark");
        body.classList.add("dark");
        footer.classList.add("dark");
    } else {
        localStorage.setItem("theme", "light");
        body.classList.remove("dark");
        footer.classList.remove("dark");
    }
});
