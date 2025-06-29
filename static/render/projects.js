const tabButtons = document.querySelectorAll('.project-tab-btn');
const tabContents = document.querySelectorAll('.project-tab-content');
const parentBgParent = document.querySelector('#project-container');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // ✅ If already active, do nothing
    if (button.classList.contains('active')) return;

    const targetId = button.getAttribute('data-tab');
    const theme = button.getAttribute('data-theme');

    parentBgParent.style.backgroundImage = `url(static/image/project-bg/${theme}.svg)`;

    // Toggle active class on buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Toggle visible content
    tabContents.forEach(content => {
      content.style.display = content.id === targetId ? 'flex' : 'none';
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang").forEach(lang => {
    const languages = Array.from(lang.classList);
    languages.splice(languages.indexOf("lang"), 1); // remove 'lang'

    languages.forEach(language => {
      let skill = language;
      if (language === "C++") skill = "CPP";
      else if (language === "C#") skill = "CS";

      const div = document.createElement("div");
      div.classList.add("rounded");

      const img = document.createElement("img");
      img.src = `static/image/icons/${skill}.png`; // ✅ fixed template string
      img.alt = skill;

      div.appendChild(img);
      lang.appendChild(div);
    });
  });
});

