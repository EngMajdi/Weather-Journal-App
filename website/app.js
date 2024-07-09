// OpenWeatherMap API key
const WEATHER_API_KEY = 'de42e12e6684894b921f6fd4c1bee467';
const WEATHER_API_UNITS = 'imperial';

// DOM elements
const zipInput = document.getElementById("zip");
const feelingsInput = document.getElementById("feelings");
const entryHolder = document.getElementById("entryHolder");
const dateDisplayer = document.getElementById("date");
const tempDisplayer = document.getElementById("temp");
const contentDisplayer = document.getElementById("content");
const generateButton = document.getElementById("generate");

// Get current date
const getCurrentDate = () => {
    const d = new Date();
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

// Function to fetch weather details from API
const getWeatherDetails = async (userZip) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${userZip}&appid=${WEATHER_API_KEY}&units=${WEATHER_API_UNITS}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// Function to update UI with recent entry
const updateUI = async () => {
    try {
        const response = await fetch('/all');
        if (!response.ok) {
            throw new Error(`Failed to fetch recent entry: ${response.status}`);
        }
        const { date, temp, content } = await response.json();
        dateDisplayer.textContent = `Date: ${date}`;
        tempDisplayer.textContent = `Temp: ${Math.round(temp)} degrees`;
        contentDisplayer.textContent = `Content: ${content}`;
    } catch (error) {
        console.error("Error updating UI:", error);
    }
};

// Event listener for generate button
const generateButtonListener = async (event) => {
    event.preventDefault();

    const zip = zipInput.value.trim();
    const feelings = feelingsInput.value.trim();

    if (!zip || !feelings) {
        alert("Please fill in both the zip code and feelings entries correctly.");
        return;
    }

    try {
        const weatherDetails = await getWeatherDetails(zip);
        const userData = {
            userZip: zip,
            content: feelings,
            temp: weatherDetails.main.temp,
            date: getCurrentDate()
        };

        await fetch("/add-entry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        await updateUI();
    } catch (error) {
        console.error("Error generating entry:", error);
        if (error.message === "city not found") {
            alert("No city found with the given zip code. Please enter a valid zip code.");
        }
    }
};

// Initialize UI when DOM content is loaded
window.addEventListener("DOMContentLoaded", updateUI);

// Add event listener to generate button
generateButton.addEventListener('click', generateButtonListener);
