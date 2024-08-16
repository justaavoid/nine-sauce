const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Import portfolio data and endpoints
const portfolioData = require('./api/portfolio');

// API endpoint to fetch portfolio data
app.get('/api/portfolio', (req, res) => {
  res.status(200).json(portfolioData);
});

// API endpoint to update portfolio data
app.post('/api/portfolio', (req, res) => {
  const updatedData = req.body;
  // Here, you would normally save updatedData to a database
  // For this example, we'll just return it
  res.status(200).json(updatedData);
});

// Route for the main page (/)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
