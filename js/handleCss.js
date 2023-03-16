// var height = parseInt(document.querySelector("div#centroid").offsetHeight);
// var h = window.innerHeight-100;

// if (height > h) {
//     document.querySelector("div#intro").style.minHeight = height.toString() + "px";
// } else if (height < h) {
//     document.querySelector("div#intro").style.minHeight = (h + height).toString() + "px";
// }

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
            document.querySelector(".sub-nav").style.borderBottom = "none";
        }
    });
});