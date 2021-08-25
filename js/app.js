$(window).on('scroll', function() {
    if ($(window).scrollTop() >= $(
            '.stopper').offset().top + $('.stopper').outerHeight() - window.innerHeight) {

        document.querySelectorAll(".nav-link").forEach((link) => {
            link.style.color = "black";
            link.addEventListener("mouseover", function() {
                link.style.borderBottom = "2px solid black"
            })
            link.addEventListener("mouseout", function() {
                link.style.borderBottom = "none"
            })
        })
        document.querySelector(".sep").style.color = "black";
        document.querySelector(".navbar-brand").style.color = "black";
        document.querySelectorAll(".social").forEach((icon) => {
            icon.style.color = "black"
        })
        document.querySelector(".navbar").style.backgroundColor = "rgb(248,249,250, 0.9)";
    }
});

document.addEventListener("scroll", function() {
    if ($(window).scrollTop() === 0) {
        document.querySelectorAll(".nav-link").forEach((link) => {
            link.style.color = "white";
            link.addEventListener("mouseover", function() {
                link.style.borderBottom = "2px solid white"
            });
            link.addEventListener("mouseout", function() {
                link.style.borderBottom = "none"
            })
        });
        document.querySelector(".sep").style.color = "white";
        document.querySelector(".navbar-brand").style.color = "white";
        document.querySelectorAll(".social").forEach((icon) => {
            icon.style.color = "white"
        });
        document.querySelector(".navbar").style.backgroundColor = "transparent";
    }
})

document.querySelectorAll(".algorithms").forEach((item) => {
    item.addEventListener("click", () => {
        window.open("algorithms/index.html", "_blank")
    })
})

document.querySelector(".codepen").addEventListener("click", function() {
    window.open("https://codepen.io/vedpanse", "_blank");
})

document.querySelector(".github").addEventListener("click", function() {
    window.open("https://github.com/vedpanse", "_blank");
})

document.querySelector(".amazon").addEventListener("click", function() {
    window.open("https://github.com/VedPanse/Python_Advanced/blob/master/AmazonPriceTracker/main.py", "_blank")
});

document.querySelector(".iss").addEventListener("click", function() {
    window.open("https://github.com/VedPanse/Python_Advanced/blob/master/ISSOverHeadNotifier/main.py", "_blank")
});

document.querySelector(".workout").addEventListener("click", function() {
    window.open("https://github.com/VedPanse/Python_Advanced/blob/master/Workout%20Tracking/main.py", "_blank")
});

function openNav() {
    document.getElementById("myNav").style.width = "50%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}