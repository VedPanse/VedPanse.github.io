document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            document.getElementById('whitie').classList.add('fixed-top');
            // add padding top to show content behind navbar
            navbar_height = document.querySelector('.sub-nav').offsetHeight;
            document.body.style.paddingTop = navbar_height + 'px';
            // document.querySelector(".sub-nav").style.borderBottom = "1px solid rgb(0, 0, 0, 0.1)";
        } else {
            document.getElementById('whitie').classList.remove('fixed-top');
            // remove padding top from body
            document.body.style.paddingTop = '0';
            // document.querySelector(".sub-nav").style.borderBottom = "none";
        }
    });
});

document.querySelector("#all-blogs").addEventListener("click", () => {
    document.querySelector("#expanded-navbar").classList.toggle("hidden");
    document.querySelector("#overlay-hide").classList.toggle("hidden");
});

document.querySelector("#overlay-hide").addEventListener("click", () => {
    alert("click")
    document.querySelector("#expanded-navbar").classList.toggle("hidden");
    document.querySelector("#overlay-hide").classList.toggle("hidden");
});