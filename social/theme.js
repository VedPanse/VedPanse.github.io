function themeChange() {
    var dark = document.querySelector("body").style.backgroundColor === "#171717";

    if (!dark) {
        changeToDark();
    } else {
        changeToLight();
    }

}

function changeToDark() {
    document.querySelector("body").style.backgroundColor = "#171717";
    document.querySelectorAll("h1").forEach((item) => {
        item.style.color = "white";
    });
    document.querySelectorAll("p").forEach((item) => {
        item.style.color = "#d2d2d7";
    });

    document.querySelectorAll("h3").forEach((item) => {
        item.style.color = "white";
    });

    document.querySelector(".leftnav").style.borderRight = "1px solid #d2d2d7";

    document.querySelectorAll(".leftnav a").forEach((item) => {
        if (item.classList.contains("active")) {
            item.style.color = "white";
        } else {
            item.style.color = "#d2d2d7";
        }
    });
}

function changeToLight() {
    document.querySelector("body").style.backgroundColor = "white";
    document.querySelectorAll("h1").forEach((item) => {
        item.style.color = "black";
    });
    document.querySelectorAll("p").forEach((item) => {
        item.style.color = "#212529";
    });
    document.querySelectorAll("h3").forEach((item) => {
        item.style.color = "black";
    });

    document.querySelectorAll(".leftnav a").forEach((item) => {
        if (item.classList.contains("active")) {
            item.style.color = "black";
        } else {
            item.style.color = "#27282c";
        }
    });
}