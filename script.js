document.addEventListener('DOMContentLoaded', function () {
  // Event listener for checking weather by city

  const searchInput = document.getElementById('cityInput')

  searchInput.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const city = searchInput.value.trim();
      if (city === '') {
        alert('Please enter a city name.');
        return;
      }
      await fetchWeather(city, 'weatherResult');
      fetchHourly(city)
    }
  });


  document.getElementById('checkWeatherBtn').addEventListener('click', async function () {
    const city = document.getElementById('cityInput').value.trim();
    if (city === '') {
      alert('Please enter a city name.');
      return;
    }
    await fetchWeather(city, 'weatherResult');
    fetchHourly(city);
  });
});

async function fetchWeather(city, elementId) {
  const apiKey = '052d8269542c454d93663aa15c76149e'; // Weatherbit API key
  await fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&key=${apiKey}`)
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

async function displayWeather(data, elementId) {
  const element = document.getElementById(elementId);
  if (data.error) {
    element.innerHTML = `<p>${data.error.message}</p>`;
  } else {
    const temperature = data.data[0].temp;
    const weatherDescription = data.data[0].weather.description;
    const humidity = data.data[0].rh;
    const windSpeed = data.data[0].wind_spd;

    const date = new Date(data.data[0].ob_time);

    element.innerHTML = `
            <h1>${data.data[0].city_name}, Weather</h1>
        <p class="updated">Updated at: ${date.toLocaleString()}</p>
        <div class="mainWeather">
          <div class="temp">
            <h1>${data.data[0].temp}</h1>
            <p class="degree">°C</p>
            <p class="feels">FEELS<br>LIKE</p>
          </div>
          <p class="feelsLike">${data.data[0].app_temp}</p>
          <img src="https://www.weatherbit.io/static/img/icons/${data.data[0].weather.icon}.png" alt="Weather Icon">
        </div>
        <div class="description">
          <p>${data.data[0].weather.description}</p>
        </div>
        <div class="stats">
          <div>
            <p class="heading">Wind</p>
            <div>
              <h2 class="number">
                ${data.data[0].wind_spd}
              </h2>
              <div>
                <p class="direction">${data.data[0].wind_cdir}</p>
                <p class="unit">mph</p>
              </div>
            </div>
          </div>
          <div>
            <p class="heading">Pressure</p>
            <div>
              <h2 class="number">
                ${data.data[0].pres}
              </h2>
              <div>
                <p class="unit">pA</p>
              </div>
              </div>
          </div>
          <div>
            <p class="heading">Humidity</p>
            <div>
              <h2 class="number">
                ${data.data[0].rh}
              </h2>
              <div>
                <p class="unit">%</p>
              </div>
            </div>
          </div>
        </div>
        `
  }
}

function fetchForecast(city, elementId) {
  const apiKey = '052d8269542c454d93663aa15c76149e'; // Weatherbit API key
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


async function fetchHourly(city) {
  const apiKey = '052d8269542c454d93663aa15c76149e';
  const baseUrl = 'https://api.weatherbit.io/v2.0/forecast/hourly';

  const url = `${baseUrl}?city=${city}&key=${apiKey}&hours=24`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    let rowStr = "";

    data.data.forEach(elem => {

      const date = new Date(elem.timestamp_local);

      const time = formatAMPM(date);

      rowStr += `
            <tr>
                <th scope="row" class="info">
                  <div>
                    <p class="date">${time}</p>
                    <p>${elem.weather.description}</p>
                    <img src="https://www.weatherbit.io/static/img/icons/${elem.weather.icon}.png" alt="Weather Icon">
                    <h1>${elem.temp}°</h1>
                  </div>
                </th>
                <td>${elem.app_temp}</td>
                <td>${elem.wind_spd}</td>
                <td>${elem.pres}</td>
              </tr>
        `
    })

    const tableStr = `
        <div class="hourly">
          <h1>Hourly Forecast</h1>

          <div class="container">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Hour</th>
                <th scope="col">Feels Like</th>
                <th scope="col">Wind</th>
                <th scope="col">Pressure</th>
              </tr>
            </thead>
            <tbody class="insertHours">
            ${rowStr}
            </tbody>
          </table>
           </div>
    </div>

        </div>
        `

    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML += tableStr;

  } catch (error) {
    console.error('Error fetching data:', error);
  }

}

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let time = hours + ':' + minutes + ' ' + ampm;
  let day = date.toLocaleDateString('en-US', { weekday: 'long' });
  return `${day}, ${time}`;
}