function themeChange() {
    if (document.body.classList.contains("dark")) {

        document.body.classList.remove("dark");
        toLight();
    } else {
        document.body.classList.add("dark");
        toDark();
    }
}

function toLight() {

    // NAVBAR
    document.querySelector(".navbar").style.backgroundColor = "white";
    document.querySelector(".navbar-brand").style.color = "black";

    document.querySelector(".navbar").style.borderBottom = "1px solid rgba(39, 40, 44, 0.2)";

    // LEFTNAV
    document.querySelector(".leftnav").style.borderRight = "1px solid rgba(39, 40, 44, 0.2)";
    document.querySelectorAll(".leftnav a").forEach((item) => {
        item.style.color = "#27282c";
    });
    document.querySelector(".leftnav a.active").style.color = "black";
}

function toDark() {

    // NAVBAR
    document.querySelector(".navbar").style.backgroundColor = "black";
    document.querySelector(".navbar-brand").style.color = "white";
    document.querySelector(".navbar").style.borderBottom = "1px solid rgb(201, 201, 201)";

    // LEFTNAV
    document.querySelector(".leftnav").style.borderRight = "1px solid rgb(201, 201, 201)";
    document.querySelectorAll(".leftnav a").forEach((item) => {
        item.style.color = "rgb(201, 201, 201)";
    });
    document.querySelector(".leftnav a.active").style.color = "white";
}