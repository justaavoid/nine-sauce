// Fetch portfolio data from the serverless function
fetch("/api/portfolio")
    .then((response) => response.json())
    .then((data) => {
        // Populate name
        document.querySelector(".name").textContent = data.name;

        // Populate social links
        const socialLinksList = document.querySelector(".social-links");
        data.socialLinks.forEach((link) => {
            const listItem = document.createElement("li");
            const anchor = document.createElement("a");
            anchor.href = link.url;
            anchor.textContent = link.platform;
            listItem.appendChild(anchor);
            socialLinksList.appendChild(listItem);
        });

        // Populate skills
        const webDevelopmentList = document.querySelector(".web-development");
        data.skills.webDevelopment.forEach((skill) => {
            const listItem = document.createElement("li");
            listItem.textContent = skill;
            webDevelopmentList.appendChild(listItem);
        });

        const programmingLanguagesList = document.querySelector(
            ".programming-languages"
        );
        data.skills.programmingLanguages.forEach((language) => {
            const listItem = document.createElement("li");
            listItem.textContent = language;
            programmingLanguagesList.appendChild(listItem);
        });

        const databasesList = document.querySelector(".databases");
        data.skills.databases.forEach((database) => {
            const listItem = document.createElement("li");
            listItem.textContent = database;
            databasesList.appendChild(listItem);
        });

        const devToolsList = document.querySelector(".dev-tools");
        data.skills.devTools.forEach((tool) => {
            const listItem = document.createElement("li");
            listItem.textContent = tool;
            devToolsList.appendChild(listItem);
        });

        // Populate experiences
        const experiencesDiv = document.querySelector(".experiences");
        data.experiences.forEach((experience) => {
            const experienceItem = document.createElement("div");
            experienceItem.innerHTML = `<h3>${experience.company}</h3>
      <p>${experience.role} - ${experience.date}</p>
      <p>${experience.description}</p>`;
            experiencesDiv.appendChild(experienceItem);
        });
    })
    .catch((error) => console.error("Error fetching portfolio data:", error));
