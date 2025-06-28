const skills = [
    "Rust",
    "Tauri",
    "C++",
    "C",
    "Kotlin",
    "Swift",
    "Python",
    "Java",
    "C#",
    "Typescript",
    "Javascript",
    "NextJS",
    "ElectronJS",
    "Firebase",
    "Raspberry Pi",
    "Arduino",
    "GitHub",
    "Bash",
    "AWK",
    "SED",
    "HTML",
    "CSS"
];


const isMobile = window.innerWidth < 768;
const containerHeight = isMobile ? 700 : 400;
const spacing = isMobile ? 15 : 45;
const xOffset = isMobile ? 10 : -90; // Center x in %
const yOffset = 50;  // Center y in %

const skillsHTML = skills.map((rawSkill, i) => {
    let skill = rawSkill;
    if (skill === "C++") skill = "CPP";
    if (skill === "C#") skill = "CS";
    if (skill === "Raspberry Pi") skill = "RaspberryPi"

    const col = Math.floor(i / 3); // 3 items per column
    const row = i % 3;

    const x = xOffset + col * (spacing * 0.866); // horizontal spacing
    const y = yOffset + row * spacing + (col % 2 === 1 ? spacing / 2 : 0); // vertical offset

return `
  <div class="skill-wrapper" style="position: absolute; left: ${x}%; top: ${y}%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center;">
    <div class="skill">
      <img src="static/image/icons/${skill}.png" alt="${rawSkill}" title="${rawSkill}" />
    </div>
    <p class="skill-label">${rawSkill}</p>
  </div>
`;



}).join('');

// Set the container height and insert content
const skillsSection = document.getElementById("skills");
skillsSection.style.height = `${containerHeight}px`;
skillsSection.innerHTML = `<h1 style="position: absolute; left: -100%;">Skills</h1>` + skillsHTML;
