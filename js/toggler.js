document.querySelectorAll("section#projects div.toggler").forEach((item) => {
    item.addEventListener("click", () => {
        document.querySelectorAll("section#projects div.toggler").forEach((e) => {
            e.classList.remove("active");
        });
        item.classList.add("active");
        changeFeature(item.classList)
    });
});

document.querySelectorAll("section#internships div.toggler").forEach((item) => {
    item.addEventListener("click", () => {
        document.querySelectorAll("section#internships div.toggler").forEach((e) => {
            e.classList.remove("active");
        });
        item.classList.add("active");

        changeFeature(item.classList)
    });
});

document.querySelectorAll("section#social div.toggler").forEach((item) => {
    item.addEventListener("click", () => {
        document.querySelectorAll("section#social div.toggler").forEach((e) => {
            e.classList.remove("active");
        });
        item.classList.add("active");
        changeFeature(item.classList)
    });
});

function changeFeature(lst) {
    var independent;
    const all_features = [
        "card",
        "toggler",
        "active"
    ]

    for (var i = 0; i < lst.length; i++) {
        if (!all_features.includes(lst[i])) {
            independent = lst[i]
        }
    }
    if (independent === "javelinLang") {
        document.querySelector("#projects-img").src = "images/javelinPreview.png"
    } else if (independent === "eAuthentication") {
        document.querySelector("#projects-img").src = "images/eAuthenticationPreview.png"
    } else if (independent === "imageParser") {
        document.querySelector("#projects-img").src = "images/imageParserPreview.png"
    } else if (independent === "BancBridge") {
        document.querySelector("#internships-img").src = "images/internshipsPreview.png"
    } else if (independent === "Magna") {
        document.querySelector("#internships-img").src = "images/MagnaPreview.png"
    } else if (independent === "spreadWarmth") {
        document.querySelector("#social-img").src = "images/Spread Warmth.jpeg"
    } else if (independent === "Eunoia") {
        document.querySelector("#social-img").src = "images/Eunoia - poster.jpeg"
    }
}