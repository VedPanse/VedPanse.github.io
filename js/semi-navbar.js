const nav = document.querySelector(".navbar.brownie")
document.addEventListener("scroll", function() {
    if ($(window).scrollTop() === 0) {
        nav.style.top = "inherit";
        nav.style.backgroundColor = "rgba(255, 255, 255)";
        nav.style.backdropFilter = "none";
        nav.style.width = "85%";
        nav.style.left = "7.5%";

    } else {
        nav.style.position = "fixed";
        nav.style.top = "0%";
        nav.style.zIndex = 5;
        nav.style.width = "85%";
        nav.style.backgroundColor = "rgba(255, 255, 255, 0.72)";
        nav.style.backdropFilter = "saturate(180%) blur(20px)";
        nav.style.width = "100%";
        nav.style.left = "0%";
    }
});