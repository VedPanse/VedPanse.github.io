document.querySelector("#all-blogs").addEventListener("click", () => {
    document.querySelector("#expanded-navbar").classList.toggle("hidden");
    document.querySelector("#overlay-hide").classList.toggle("hidden");
});

document.querySelector("#share").addEventListener("click", () => {
    var text = window.location.href;
    navigator.clipboard.writeText(text).then(function() {
      alert('Link copied!');
    }, function(err) {
      alert('Error while copying link: ', err);
    });
})