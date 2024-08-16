// api/portfolio.js
export default function handler(req, res) {
  const portfolioData = {
    name: "Kishore Lavuri",
    socialLinks: [
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/in/kishore-babu-lavuri/",
      },
      { platform: "X (Twitter)", url: "https://x.com/kishore_lavuri" },
      { platform: "Medium", url: "https://medium.com/@kishore_lavuri" },
    ],
    skills: {
      webDevelopment: ["HTML", "CSS", "Tailwind", "React"],
      programmingLanguages: ["JavaScript", "Python", "Java"],
      databases: ["SQL", "MongoDB"],
      devTools: ["GitHub", "Visual Studio"],
    },
    experiences: [
      {
        company: "SAFE Organization",
        role: "Web Developer",
        date: "Feb 2023",
        description:
          "Developed a responsive website for SAFE using HTML, CSS, and JavaScript.",
      },
      {
        company: "Sytiqhub",
        role: "Intern",
        date: "May 2024",
        description:
          "Gained hands-on experience in Machine Learning techniques and algorithms.",
      },
    ],
  };

  res.status(200).json(portfolioData);
}
