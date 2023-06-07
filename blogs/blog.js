document.querySelector("#share").addEventListener("click", () => {
    var text = window.location.href;
    navigator.clipboard.writeText(text).then(function() {
      alert('Link copied!');
    }, function(err) {
      alert('Error while copying link: ', err);
    });
})