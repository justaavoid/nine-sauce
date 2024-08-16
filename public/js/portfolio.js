// portfolio.js
document.addEventListener('DOMContentLoaded', () => {
    const fetchPortfolioData = async () => {
        try {
            const response = await fetch('/api/portfolio');
            const data = await response.json();

            // Display portfolio data
            document.querySelector('.name').textContent = data.name;

            const socialLinks = document.getElementById('social-links');
            data.socialLinks.forEach(link => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="${link.url}" target="_blank">${link.platform}</a>`;
                socialLinks.appendChild(listItem);
            });

            const skills = document.getElementById('skills');
            for (const [category, items] of Object.entries(data.skills)) {
                const section = document.createElement('div');
                section.innerHTML = `<h3>${category.replace(/([A-Z])/g, ' $1').trim()}</h3>`;
                const list = document.createElement('ul');
                items.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = item;
                    list.appendChild(listItem);
                });
                section.appendChild(list);
                skills.appendChild(section);
            }

            const experiences = document.getElementById('experiences');
            data.experiences.forEach(exp => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>${exp.company}</strong> - ${exp.role} (${exp.date})<br>
                    ${exp.description}
                `;
                experiences.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
        }
    };

    fetchPortfolioData();

    // Handle form submission
    const form = document.getElementById('portfolio-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const updatedData = await response.json();
            console.log('Portfolio updated:', updatedData);
            // Optionally, re-fetch and display the updated data
            fetchPortfolioData();
        } catch (error) {
            console.error('Error updating portfolio data:', error);
        }
    });
});
