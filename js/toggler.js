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
    const link = document.querySelector("#projectURL")
    const link2 = document.querySelector("#internURL")
    const link3 = document.querySelector("#socialURL")
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
    smallResized(independent)

    if (independent === "javelinLang") {
        document.querySelector("#projects-img").src = "images/javelinPreview.png";
        link.href = "https://github.com/VedPanse/javelin-lang";

    } else if (independent === "eAuthentication") {
        document.querySelector("#projects-img").src = "images/eAuthenticationPreview.png"
        link.href = "https://github.com/VedPanse/eAuthentication";

    } else if (independent === "imageParser") {
        document.querySelector("#projects-img").src = "images/imageParserPreview.png";
        link.href = "https://github.com/VedPanse/image-text-parser";

    } else if (independent === "BancBridge") {
        document.querySelector("#internships-img").src = "images/internshipsPreview.png";
        link2.href = "work/bancbridge.html";

    } else if (independent === "Magna") {
        document.querySelector("#internships-img").src = "images/MagnaPreview.png";
        link2.href = "work/magna.html";

    } else if (independent === "spreadWarmth") {
        document.querySelector("#social-img").src = "images/Spread Warmth.jpeg";
        link3.href = "social/spread-warmth.html";

    } else if (independent === "Eunoia") {
        document.querySelector("#social-img").src = "images/Eunoia - poster.jpeg";
        link3.href = "social/eunoia.html";
    }
}


function smallResized(independent) {
    if (document.body.clientWidth <= 575) {
        if (independent === "javelinLang") {
            window.location.href = "https://github.com/VedPanse/javelin-lang";

        } else if (independent === "eAuthentication") {
            window.location.href = "https://github.com/VedPanse/eAuthentication";

        } else if (independent === "imageParser") {
            window.location.href = "https://github.com/VedPanse/image-text-parser";

        } else if (independent === "BancBridge") {
            window.location.href = "work/bancbridge.html";

        } else if (independent === "Magna") {
            window.location.href = "work/magna.html";

        } else if (independent === "spreadWarmth") {
            window.location.href = "social/spread-warmth.html";

        } else if (independent === "Eunoia") {
            window.location.href = "social/eunoia.html";
        }
    }
}