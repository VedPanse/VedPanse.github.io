document.addEventListener("scroll", function() {
    if ($(window).scrollTop() === 0) {
        document.querySelector(".navbar.brownie").style.top = "inherit";

    } else {
        document.querySelector(".navbar.brownie").style.position = "fixed";
        document.querySelector(".navbar.brownie").style.top = "0%";
        document.querySelector(".navbar.brownie").style.zIndex = 5;
        document.querySelector(".navbar.brownie").style.width = "85%";
        document.querySelector(".navbar.brownie").style.backgroundColor = "rgba(255, 255, 255, 0.72)";
        document.querySelector(".navbar.brownie").style.backdropFilter = "saturate(180%) blur(20px)";
    }
});