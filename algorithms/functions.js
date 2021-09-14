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

document.getElementById("home").addEventListener("click", function() {
    home()
})

document.querySelector(".u").addEventListener("click", function() {
    window.location.href = "../index.html"
});

// let dark_mode = false

// document.querySelector("body").addEventListener("keydown", function(e) {
//     if (e.which === 27) {
//         if (dark_mode === false) {
//             changeToDark()
//         } else {
//             document.querySelector("body").style.color = "black";
//             document.querySelector(".context").style.color = "black";
//             document.querySelector(".u").style.color = "black";
//             document.querySelector("body").style.backgroundColor = "white";
//             dark_mode = false
//         }
//         console.log(dark_mode)
//     }
// });

// function changeToDark() {
//     document.querySelector("body").style.color = "#f5f5f7";
//     document.querySelector(".context").style.color = "#f5f5f7";
//     document.querySelector(".u").style.color = "#7f52ff";
//     document.querySelector("body").style.backgroundColor = "black";
//     dark_mode = true
// }

// console.log(dark_mode)

document.addEventListener("scroll", function() {
    if ($(window).scrollTop() === 0) {
        document.querySelector(".loc-band").style.top = "inherit";
        document.querySelector(".loc-band").style.borderBottom = "none"
    } else {
        document.querySelector(".loc-band").style.top = "0%";
        document.querySelector(".loc-band").style.borderBottom = "1px solid gray"
    }
});

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}