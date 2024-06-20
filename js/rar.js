document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".rar").forEach((item) => {
        const content = item.innerHTML;
        item.innerHTML = content + " <img src='images/right-arrow.svg' alt=''>";
    });
});