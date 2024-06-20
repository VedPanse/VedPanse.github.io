function getStarted() {
    darkRelocation();
    window.location.href = "index.html" + pass_down;

}

function lineGraphs() {
    darkRelocation();
    window.location.href = "line-graph.html" + pass_down;

}

function barGraphs() {
    darkRelocation();
    window.location.href = "bar-graph.html" + pass_down;

}

function histograms() {
    darkRelocation();
    window.location.href = "histograms.html" + pass_down;

}

function scatterPlots() {
    darkRelocation();
    window.location.href = "scatterplots.html" + pass_down;

}

function pieCharts() {
    darkRelocation();
    window.location.href = "pie-chart.html" + pass_down;

}

function violinPlots() {
    darkRelocation();
    window.location.href = "violinplots.html" + pass_down;

}

function boxPlots() {
    darkRelocation();
    window.location.href = "boxplots.html" + pass_down;

}

function hash() {
    darkRelocation();
    window.location.href = "hash-tables.html" + pass_down;
}


function bfs() {
    darkRelocation();
    window.location.href = "breadth-first.html" + pass_down;

}

function ig() {
    darkRelocation();
    window.location.href = "implementing.html" + pass_down;

}

function dja() {
    darkRelocation();
    window.location.href = "dja.html" + pass_down;

}

function idja() {
    darkRelocation();

    window.location.href = "implement-dja.html" + pass_down;

}

function dynamic() {
    darkRelocation();

    window.location.href = "dynamic.html" + pass_down;

}


document.querySelector(".u").addEventListener("click", function() {
    window.open("https://vedpanse.com", "_blank")
});




// DARK



let dark_mode = false

document.querySelector("body").addEventListener("keydown", function(e) {
    if (e.which === 27) {
        if (dark_mode === false) {
            changeToDark();
        } else {
            changeToLight();
            // console.log(dark_mode)
        }
    }
});

function changeToLight() {
    document.querySelectorAll(".overlay-content a").forEach((item) => {
        item.style.color = "white";
    });

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
            if (item.classList.contains("active")) {
                item.style.backgroundColor = "#27282c"
            } else {
                item.style.backgroundColor = "rgb(228, 228, 228)";
            }
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
    document.querySelectorAll("table.linear tr").forEach((item) => {
        item.style.border = "1px solid black";
    });
    document.querySelectorAll("table.linear td").forEach((item) => {
        item.style.borderRight = "1px solid black";
    });

    dark_mode = false
}

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

    document.querySelectorAll("table.linear tr").forEach((item) => {
        item.style.border = "1px solid white";
    });
    document.querySelectorAll("table.linear td").forEach((item) => {
        item.style.borderRight = "1px solid white";
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
let pass_down

function darkRelocation() {
    if (dark_mode) {
        pass_down = "#dark"
    } else {
        pass_down = "#light"
    }
}

const url = document.URL
if (url.slice(url.length - 5) === "light") {
    changeToLight()
} else if (url.slice(url.length - 4) === "dark") {
    changeToDark()
}

function closeDarkNotifier() {
    document.querySelector(".dark-notifier").style.display = "none";
    document.querySelector(".dark-alt").style.display = "none";

}


if (url.slice(url.length - 10) === "index.html") {
    // document.querySelector(".fas.fa-times").addEventListener("click", closeDarkNotifier())
}