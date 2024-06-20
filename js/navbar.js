document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const header = document.getElementById("header");

    const xMark = "<i class=\"fa-solid fa-xmark\"></i>";
    const hamMark = "<i class=\"fa-solid fa-bars\"></i>";

    menuIcon.addEventListener("click", () => {
        header.classList.toggle("show");

        if (header.classList.contains("show")) {
            menuIcon.innerHTML = xMark;
        } else {
            menuIcon.innerHTML = hamMark;
        }
    });
});