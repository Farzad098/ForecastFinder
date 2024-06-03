document.addEventListener('DOMContentLoaded', function() {
    // Event listener for checking weather by city
    document.getElementById('checkWeatherBtn').addEventListener('click', function() {
        const city = document.getElementById('cityInput').value.trim();
        if (city === '') {
            alert('Please enter a city name.');
            return;
        }
        fetchWeather(city, 'weatherResult');
        fetchForecast(city, 'forecastResult');
    });
});

function fetchWeather(city, elementId) {
    const apiKey = 'c7296a06ae144a218f5d2483a9d7d9de'; // Weatherbit API key
    fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data, elementId);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            const element = document.getElementById(elementId);
            element.innerHTML = '<p>There was an error fetching the weather data. Please try again later.</p>';
        });
}

function displayWeather(data, elementId) {
    const element = document.getElementById(elementId);
    if (data.error) {
        element.innerHTML = `<p>${data.error.message}</p>`;
    } else {
        const temperature = data.data[0].temp;
        const weatherDescription = data.data[0].weather.description;
        const humidity = data.data[0].rh;
        const windSpeed = data.data[0].wind_spd;

        element.innerHTML = `
            <div class="weatherDetails">
                <p>Temperature: ${temperature}°C</p>
                <p>Weather: ${weatherDescription}</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
        `;
    }
}

function fetchForecast(city, elementId) {
    const apiKey = 'c7296a06ae144a218f5d2483a9d7d9de'; // Weatherbit API key
    fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data, elementId);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            const element = document.getElementById(elementId);
            element.innerHTML = '<p>There was an error fetching the forecast data. Please try again later.</p>';
        });
}

function displayForecast(data, elementId) {
    const element = document.getElementById(elementId);
    if (data.error) {
        element.innerHTML = `<p>${data.error.message}</p>`;
    } else {
        const forecast = data.data.slice(1, 6); // Get the next 5 days forecast
        let forecastHTML = '<h2>5-Day Forecast</h2>';
        forecast.forEach(day => {
            const date = new Date(day.valid_date).toLocaleDateString('en-US', { weekday: 'long' });
            const weatherDescription = day.weather.description;
            const maxTemp = day.max_temp;
            const minTemp = day.min_temp;
            forecastHTML += `
                <div class="forecastDay">
                    <p>${date}</p>
                    <p>${weatherDescription}</p>
                    <p>Max Temp: ${maxTemp}°C</p>
                    <p>Min Temp: ${minTemp}°C</p>
                </div>
            `;
        });
        element.innerHTML = forecastHTML;
    }
}
