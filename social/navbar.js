document.querySelector("#all-blogs").addEventListener("click", () => {
    document.querySelector("#expanded-navbar").classList.toggle("hidden");
    document.querySelector("#overlay-hide").classList.toggle("hidden");
});

document.querySelector("#overlay-hide").addEventListener("click", () => {
    alert("click")
    document.querySelector("#expanded-navbar").classList.toggle("hidden");
    document.querySelector("#overlay-hide").classList.toggle("hidden");
});