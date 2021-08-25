function openNav() {
    document.getElementById("myNav").style.width = "50%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

let query
const access = document.querySelector("#accessibility-body").textContent
document.querySelector("#search").addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
        query = document.querySelector("#search").value

        console.log(access)
    }
})