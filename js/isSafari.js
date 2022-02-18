var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
    document.querySelector("div#index").style.display = "none";
}