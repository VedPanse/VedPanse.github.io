const skills = ["Python", "C", "C++", "Swift", "C#", "Java", "Kotlin", "Javascript", "Typescript", "AWK", "SED", "Bash", "HTML", "CSS"];

const containerHeight = 400; // in pixels
const spacing = 45;
const xOffset = -40; // Center x in %
const yOffset = 50;  // Center y in %

const skillsHTML = skills.map((rawSkill, i) => {
    let skill = rawSkill;
    if (skill === "C++") skill = "CPP";
    if (skill === "C#") skill = "CS";

    const col = Math.floor(i / 3); // 3 items per column
    const row = i % 3;

    const x = xOffset + col * (spacing * 0.866); // horizontal spacing
    const y = yOffset + row * spacing + (col % 2 === 1 ? spacing / 2 : 0); // vertical offset

    return `<div class="skill" style="position: absolute; left: ${x}%; top: ${y}%; transform: translate(-50%, -50%);">
                <img src="static/image/icons/${skill}.png" alt="${rawSkill}"/>
            </div>`;
}).join('');

// Set the container height and insert content
const skillsSection = document.getElementById("skills");
skillsSection.style.height = `${containerHeight}px`;
skillsSection.innerHTML = `<h1 style="position: absolute; left: -130%;">Skills</h1>` + skillsHTML;
