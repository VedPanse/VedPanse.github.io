const workExperience = [
    {
        company: "Spuddie.ai",
        position: "Software Engineering Intern",
        duration: "April 2025 - May 2025",
        imageUrl: "static/image/logos/spuddie.png",
        link: "https://spuddie.ai",
        description: `Delivered a memory model using vector databases which drastically improved the relevance of AI interactions for 500+ users, leading to a 20% increase in positive feedback scores.
Pioneered a user story retention architecture, scrutinizing 110+ user interactions to refine AI response precision, culminating in a 30% surge in positive user feedback scores regarding AI helpfulness.
`
    },
    {
        company: "Rocket Propulsion",
        position: "Avionics Engineering Intern",
        duration: "September 2024 - May 2025",
        imageUrl: "static/image/logos/rpl.png",
        link: "https://rocketpropulsion.ca",
        description: `Engineered a robust avionics software system for a 3D-printed rocket, enhancing telemetry data transmission by 40% through the development of a custom communication protocol.
Implemented a real-time data processing pipeline using Python and C++, enabling the rocket to transmit critical flight data at speeds exceeding 1 Mbps, significantly improving data accuracy and reliability during test flights.
`    },
    {
        company: "Computer Science Engineering Society",
        position: "Software Engineering Intern",
        duration: "September 2024 - May 2025",
        imageUrl: "static/image/logos/cses.png",
        description: `Developed a comprehensive event management system using React.js and Node.js, streamlining the organization of 50+ events for 1,000+ students, resulting in a 30% increase in event participation.
        Implemented a real-time notification system using WebSockets, enhancing communication efficiency and engagement for over 1,000 students, leading to a 25% reduction in event-related inquiries.
        Spearheaded the integration of a user-friendly dashboard for event organizers, enabling real-time tracking of registrations and feedback, which improved event planning efficiency by 40%.
        `
    },
    {
        company: "Venture Shares",
        position: "Software Engineering Intern",
        duration: "June 2024 - December 2024",
        imageUrl: "static/image/logos/ventureshares.png",
        link: "https://ventureshares.io",
        description: `Spearheaded the entire frontend architecture for a private/public market data platform using Next.js, React.js, NextUI, and TailwindCSS.
Integrated pagination features for a financial data platform to display 10,000+ daily records, increasing data accessibility and reducing page load times by 20% for optimal user experience.
Implemented REST APIs for instant market data updates, ensuring 10,000+ records refreshed daily; personally resolved 5 critical API bugs within the first week, improving data reliability.
`
    },
    {
        company: "Pepper Advantage",
        position: "Software Engineering Intern",
        duration: "June 2023 - August 2023",
        imageUrl: "static/image/logos/pepper-advantage.png",
        link: "https://www.pepper-advantage.com",
        description: `Automated the classification of scanned documents using a Python-based AI model trained on over 5,000 documents, boosting data processing speeds by an impressive 70% weekly.
        Developed a sophisticated image processing pipeline using Tesseract and OpenCV to classify and auto-catalog scanned files, leading to an estimated 85% reduction in manual sorting time.`
    },
    {
        company: "Findability Sciences",
        position: "Data Science Intern",
        duration: "April 2022 - May 2022",
        imageUrl: "static/image/logos/findability.png",
        link: "https://findability.ai",
        description: `Conducted exploratory data analysis on over 10,000 U.S. real estate records to identify pricing trends and regional anomalies, enhancing data-driven decision-making for stakeholders.
Improved machine learning model accuracy by 18% through the implementation of outlier detection techniques using Isolation Forest and statistical thresholds during data cleaning processes.`
    },
    {
        company: "Xceed Imagination",
        position: "Software Engineering Intern",
        duration: "June 2021 - July 2021",
        imageUrl: "static/image/logos/xceed.png",
        link: "https://xceedimagination.com",
        description: `Developed a robust Spring Boot web platform that batch-ran client macros, reducing the financial reconciliation cycle time by 60%, enhancing operational efficiency for Magna International.
Automated essential back-office tasks which streamlined workflows and contributed to significant time savings across the finance department, allowing teams to focus on strategic initiatives.`
    },
    {
        company: "BancBridge Software Systems",
        position: "Software Engineering Intern",
        duration: "March 2018 - June 2019",
        imageUrl: "static/image/logos/bancbridge.png",
        link: "https://bancbridge.com",
        description: `Designed and developed a web application that logs financial data for Wells Fargo bank, enhancing data accessibility and reducing logging time by approximately 30% through streamlined processes.
Upgraded BancBridge’s company website using Vanilla JavaScript, improving user experience and increasing page load speed by 25%, leading to higher user engagement rates.
`
    }
]

document.addEventListener("DOMContentLoaded", function () {
    const rowElement = document.querySelector("section#work-experience div.row");

    workExperience.forEach(job => {
        const jobElement = document.createElement("div");
        const overlayContainer = document.createElement("div");
        overlayContainer.classList.add("col-lg-3");
        jobElement.classList.add("job");
        jobElement.style.width = "100%";
        jobElement.style.aspectRatio = "1 / 1";

        const jobDescription = document.createElement("div");
        jobDescription.classList.add("job-description");

        jobDescription.textContent = job.position;

        const companyElement = document.createElement("img");
        companyElement.setAttribute('src', job.imageUrl);

        overlayContainer.addEventListener("click", function () {
            window.open(job.link, "_blank");
        });
        overlayContainer.style.cursor = "pointer";
        overlayContainer.style.marginBottom = "20px";

        jobElement.appendChild(companyElement);
        jobElement.appendChild(jobDescription);
        overlayContainer.appendChild(jobElement);
        rowElement.appendChild(overlayContainer);
    });
});