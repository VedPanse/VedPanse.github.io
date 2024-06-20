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

    // SMALL SCREEN SIZE
    const windowWidth = window.innerWidth;

    // Show header instead of navbar-nav
    const hamburgerMenu = document.querySelectorAll("span.navbar-toggler-icon")[0];
    hamburgerMenu.addEventListener("click", () => {
        header.classList.toggle("show");
    });

    if (windowWidth <= 1000) {
        // Add download resume button to div#header
        const resumeButton = document.createElement("button");
        resumeButton.innerHTML = "Download Resume";

        const classList = ["btn", "resume"];

        classList.forEach((className) => {
            resumeButton.classList.add(className);
        });

        const link = "https://docs.google.com/document/d/1EMRoPJlL2s6foPICjBWRBImDrlklFWoK/edit#heading=h.gjdgxs";

        resumeButton.addEventListener("click", () => {
            window.open(link, '_blank')
        })

        header.appendChild(resumeButton);

        // When a header link is clicked, close header
        const allHeaderLinks = document.querySelectorAll("div#header a");
        allHeaderLinks.forEach((item) => {
            item.addEventListener("click", function () {
                header.classList.toggle("show");
            })
        });
    }
});