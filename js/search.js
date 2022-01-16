var query;

document.querySelector("#search-box").addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
        query = e.target.value;
        alert(query)
    }
});