// Requiring necessary modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Start up an instance of app
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('website'));

// Setup Server
const port = 8080;
const server = app.listen(port, () => console.log(`Server is up and running on port ${port}`));

// Handler to get recent weather data
const getRecentWeather = (req, res) => {
    if (!Object.values(projectData).every(value => value)) {
        return res.status(400).json({ message: "Empty object" });
    } 
    res.status(200).json(projectData);
};

// Handler to save client details on server
const postEntry = async (req, res) => {
    const { userZip, content, temp, date } = req.body;
    if (![userZip, content, temp, date].every(value => value)) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    projectData = { userZip, content, temp, date };
    res.status(200).json({ message: "Entry has been saved." });
};

// Http requests
app.get('/all', getRecentWeather);
app.post('/add-entry', postEntry);
