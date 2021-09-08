$(window).on('scroll', function() {
    if ($(window).scrollTop() >= $(
            '.stopper').offset().top + $('.stopper').outerHeight() - window.innerHeight) {

        document.querySelectorAll(".nav-link").forEach((link) => {
            link.style.color = "black";
            link.addEventListener("mouseover", function() {
                link.style.color = "#0063cc"
            })
            link.addEventListener("mouseout", function() {
                link.style.color = "black"
            })
        })

        document.querySelector(".navbar-brand").style.color = "black";
        if (light) {
            document.querySelector(".sep").style.color = "black";
            document.querySelectorAll(".social").forEach((icon) => {
                icon.style.color = "black"
            })
        } else {
            document.querySelector(".sep").style.color = "white";
            document.querySelectorAll(".social").forEach((icon) => {
                icon.style.color = "white"
            })
        }
        document.querySelector(".navbar").style.backgroundColor = "rgb(248,249,250, 0.9)";
    }
});

document.addEventListener("scroll", function() {
    if ($(window).scrollTop() === 0) {
        document.querySelectorAll(".nav-link").forEach((link) => {
            link.style.color = "rgba(255,255,255,.5)";
            link.addEventListener("mouseover", function() {
                link.style.color = "white"
            });
            link.addEventListener("mouseout", function() {
                link.style.color = "rgba(255,255,255,.5)"
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

let light = true

document.querySelector("#toggle").addEventListener("click", function(e) {
    if (light) {
        light = false
    } else {
        light = true
    }
    changeTheme();
})

function changeTheme() {
    if (light) {
        document.querySelector("body").style.backgroundColor = "white";
        document.querySelector("body").style.color = "black";
        document.querySelector("#skills").style.backgroundColor = "#f3f3f3";
        document.querySelectorAll(".progress-bar-success").forEach((item) => {
            item.style.backgroundColor = "black";
        });

        document.querySelectorAll(".progress").forEach((item) => {
            item.style.backgroundColor = "#d2d2d7";
        });

        // CARD

        document.querySelectorAll(".card").forEach((item) => {
            item.style.backgroundColor = "white";
            item.style.border = "1px solid rgba(0,0,0,.125)";
        });

        // CODEPEN STATS
        document.querySelector("#codepen-stats").style.backgroundColor = "#f3f3f3";


        // CONTACT

        document.querySelector("#contact").style.padding = "auto";
        document.querySelector("#contact").style.backgroundColor = "white";
        document.querySelectorAll("input").forEach((box) => {
            box.style.backgroundColor = "white";
            box.style.color = "black";
        });

        document.querySelectorAll("textarea").forEach((box) => {
            box.style.backgroundColor = "white";
            box.style.color = "black";
        });

    } else {
        document.querySelectorAll(".btn-primary").forEach((item) => {
            item.style.backgroundColor = "#233ef7";
        })
        document.querySelector("body").style.backgroundColor = "#1e1e1f";
        document.querySelector("body").style.color = "white";
        document.querySelector("#skills").style.backgroundColor = "black";
        document.querySelectorAll(".progress-bar-success").forEach((item) => {
            item.style.backgroundColor = "#233ef7";
        });

        document.querySelectorAll(".progress").forEach((item) => {
            item.style.backgroundColor = "#1e1e1f";
        });

        // CARD

        document.querySelectorAll(".card").forEach((item) => {
            item.style.backgroundColor = "#1a1a1a";
            item.style.border = "1px solid white";
        });

        // CODEPEN STATS
        document.querySelector("#codepen-stats").style.backgroundColor = "black";

        // CONTACT

        document.querySelector("#contact").style.padding = "5%";
        document.querySelector("#contact").style.backgroundColor = "black";

        document.querySelectorAll("input").forEach((box) => {
            box.style.backgroundColor = "black";
            box.style.color = "white";
        });

        document.querySelectorAll("textarea").forEach((box) => {
            box.style.backgroundColor = "black";
            box.style.color = "white";
        });

        // FOOTER

        document.querySelector("footer").style.backgroundColor = "black";
        document.querySelector("footer").style.padding = "2%";
        document.querySelectorAll("footer a").forEach((anchor) => {
            anchor.style.color = "white";
        })
    }
}