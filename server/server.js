function themeChange() {
    if (document.body.classList.contains("dark")) {
        alert("True")
        document.body.classList.remove("dark")
    } else {
        alert("False")
        document.body.classList.add("dark")
    }
}