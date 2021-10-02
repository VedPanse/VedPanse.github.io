function themeChange() {
    var dark = document.querySelector("body").style.backgroundColor === "black";

    if (!dark) {
        changeToDark();
    } else {
        changeToLight();
    }

}

function changeToDark() {
    document.querySelector("body").style.backgroundColor = "black";
    document.querySelector("h1").style.color = "white";
}