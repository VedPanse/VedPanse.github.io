function getStarted() {
    window.location.href = "get-started.html"
}

function introduction() {
    window.location.href = "introduction.html"
}

function searches() {
    window.location.href = "searches.html"
}

function bigo() {
    window.location.href = "bigo.html"
}

function arrays_lists() {
    window.location.href = "arrays_lists.html"
}

function recursion() {
    window.location.href = "recursion.html"
}

function stacking() {
    window.location.href = "stacking.html"
}

function sorting() {
    window.location.href = "sorting.html"
}

function hash() {
    window.location.href = "hash-tables.html"
}

function bfs() {
    window.location.href = "breadth-first.html"
}

function home() {
    window.location.href = "index.html"
}

function ig() {
    window.location.href = "implementing.html"
}

function dja() {
    window.location.href = "dja.html"
}

function idja() {
    window.location.href = "implement-dja.html"
}

function dynamic() {
    window.location.href = "dynamic.html"
}

document.getElementById("home").addEventListener("click", function() {
    home()
});

document.querySelector(".u").addEventListener("click", function() {
    window.open("../index.html", "_blank")
});




// DARK



let dark_mode = false

document.querySelector("body").addEventListener("keydown", function(e) {
    if (e.which === 27) {
        if (dark_mode === false) {
            changeToDark()
        } else {
            document.querySelector("body").style.color = "black";
            document.querySelector(".context").style.color = "black";
            document.querySelector(".u").style.color = "black";
            document.querySelector("body").style.backgroundColor = "white";
            document.querySelector(".leftnav").style.borderRight = "1px solid rgba(39, 40, 44, .2)";
            document.querySelectorAll(".terminal").forEach((item) => {
                item.style.backgroundColor = "#f5f2f0";
            })
            document.querySelectorAll("pre").forEach((item) => {
                item.style.color = "black";
            });
            document.querySelectorAll(".content-bar .active").forEach((item) => {
                item.style.color = "black";
                item.style.borderLeft = "2px solid black"
            });
            document.querySelectorAll(".leftnav .active").forEach((item) => {
                item.style.color = "white";
                item.style.borderLeft = "none"
            });

            document.querySelectorAll(".leftnav p").forEach((item) => {
                item.addEventListener("mouseover", function() {
                    item.style.backgroundColor = "rgb(228, 228, 228)";
                });
                item.addEventListener("mouseout", function() {
                    if (item.classList.contains("active")) {
                        item.style.backgroundColor = "#27282c";
                    } else {
                        item.style.backgroundColor = "transparent";
                    }
                });
            });

            document.querySelectorAll(".content-bar a").forEach((item) => {
                item.addEventListener("mouseover", function() {
                    item.style.color = "black";
                });
                item.addEventListener("mouseout", function() {
                    if (item.classList.contains("active")) {
                        item.style.color = "black";
                    } else {
                        item.style.color = "gray";
                    }
                });
            });

            document.querySelector(".loc-band").style.backgroundColor = "rgb(245, 245, 247, 0.8)";
            document.querySelectorAll(".loc-band a").forEach((item) => {
                item.style.color = "black";
                item.addEventListener("mouseout", function() {
                    item.style.color = "black"
                });
            });


            dark_mode = false
        }
        // console.log(dark_mode)
    }
});

function changeToDark() {
    document.querySelector("body").style.color = "#f5f5f7";
    document.querySelector(".context").style.color = "#f5f5f7";
    document.querySelector(".u").style.color = "#7f52ff";
    document.querySelector("body").style.backgroundColor = "black";
    document.querySelector(".leftnav").style.borderRight = "1px solid gray";
    document.querySelectorAll(".terminal").forEach((item) => {
        item.style.backgroundColor = "#333";
    });
    document.querySelectorAll("pre").forEach((item) => {
        item.style.color = "white";
    });
    document.querySelectorAll(".content-bar .active").forEach((item) => {
        item.style.color = "white";
        item.style.borderLeft = "2px solid white"
    });
    document.querySelectorAll(".leftnav .active").forEach((item) => {
        item.style.color = "white";
        item.style.borderLeft = "2px solid white"
    });

    document.querySelectorAll(".leftnav p").forEach((item) => {
        item.addEventListener("mouseover", function() {
            item.style.backgroundColor = "#27282c";
        });
        item.addEventListener("mouseout", function() {
            if (item.classList.contains("active")) {
                item.style.backgroundColor = "#27282c";
            } else {
                item.style.backgroundColor = "transparent";
            }
        });
    });

    document.querySelectorAll(".content-bar a").forEach((item) => {
        item.addEventListener("mouseover", function() {
            item.style.color = "white";
        });
        item.addEventListener("mouseout", function() {
            if (item.classList.contains("active")) {
                item.style.color = "white";
            } else {
                item.style.color = "gray";
            }
        });
    });

    document.querySelector(".loc-band").style.backgroundColor = "rgb(48, 48, 48, 0.8)";
    document.querySelectorAll(".loc-band a").forEach((item) => {
        item.style.color = "white";
        // Secluded start //
        item.addEventListener("mouseover", function() {
            item.style.color = "#7f52ff"
        });
        item.addEventListener("mouseout", function() {
            item.style.color = "white"
        });
        // Secluded end //
    });


    dark_mode = true

}

// console.log(dark_mode)



// DARK




document.addEventListener("scroll", function() {
    if ($(window).scrollTop() === 0) {
        document.querySelector(".loc-band").style.top = "inherit";
        document.querySelector(".loc-band").style.borderBottom = "none"
    } else {
        document.querySelector(".loc-band").style.top = "0%";
        if (dark_mode) {
            document.querySelector(".loc-band").style.borderBottom = "1px solid rgb(87, 87, 87)";
        } else {
            document.querySelector(".loc-band").style.borderBottom = "1px solid gray";
        }
    }
});

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}