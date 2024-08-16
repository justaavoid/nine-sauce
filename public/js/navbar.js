// navbar.js
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');

    navbar.innerHTML = `
        <ul>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#update-form">Update</a></li>
            <!-- Add more navigation items as needed -->
        </ul>
    `;
});
