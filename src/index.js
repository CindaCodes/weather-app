//update current temperature
function refreshWeather(response) {
  let cityElement = document.querySelector("#city");
  let countryElement = document.querySelector("#country");
  let date = new Date(response.data.time * 1000);
  let degree = response.data.wind.degree;
  let descriptionElement = document.querySelector("#description");
  let feelsLikeElement = document.querySelector("#feels-like");
  let humidityElement = document.querySelector("#humidity");
  let iconElement = document.querySelector("#icon");
  let pressureElement = document.querySelector("#pressure");
  let temperature = response.data.temperature.current;
  let temperatureElement = document.querySelector("#temperature");
  let timeElement = document.querySelector("#time");
  let windSpeedElement = document.querySelector("#wind-speed");

  cityElement.innerHTML = response.data.city;
  countryElement.innerHTML = response.data.country;
  descriptionElement.innerHTML = response.data.condition.description;
  feelsLikeElement.innerHTML = response.data.temperature.feels_like;
  humidityElement.innerHTML = response.data.temperature.humidity;
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;
  pressureElement.innerHTML = response.data.temperature.pressure;
  temperatureElement.innerHTML = Math.round(temperature);
  timeElement.innerHTML = formatDate(date);
  windSpeedElement.innerHTML = response.data.wind.speed;

  const degreeLabel = document.querySelector("#degree");
  const needle = document.querySelector("#compass-needle");
  degreeLabel.textContent = `${degree}`;
  needle.style.transform = `translate(-50%, -100%) rotate(${degree}deg)`;
  const cardinalDirection = document.querySelector("#degree").innerHTML;
  const windDirection = document.querySelector("#cardinal-direction");
  windDirection.innerHTML = degreesToCardinal(cardinalDirection);
  getForecast(response.data.city, unitSystem);
}

//Date/Time
function formatDate(dateTime) {
  let date = dateTime.getDate();
  let hours = dateTime.getHours();
  let minutes = dateTime.getMinutes();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[dateTime.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemper",
    "October",
    "November",
    "December",
  ];

  let month = months[dateTime.getMonth()];
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day}, ${month} ${date}, at ${hours}:${minutes}`;
}

//api
function searchCity(city, units) {
  let apiKey = "a050491735e3o6daf6dd43f3ab206bct";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(refreshWeather);
}

//Search changes location title
function handleSearchSubmit(event) {
  event.preventDefault();
  let cityElement = document.querySelector("#city");
  let searchInput = document.querySelector("#search-form-input");
  cityElement.innerHTML = searchInput.value;
  searchCity(searchInput.value, unitSystem);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

// Units Toggle
function changeUnits(event) {
  let city = document.querySelector("#city").innerHTML;
  let feelsUnit = document.querySelector("#feels-unit-type");
  let tempUnit = document.querySelector("#unit-type");
  let windUnit = document.querySelector("#wind-unit");

  if (event.target.checked) {
    unitSystem = "imperial";
    feelsUnit.innerHTML = "°F";
    tempUnit.innerHTML = "°F";
    windUnit.innerHTML = "mph";
  } else {
    unitSystem = "metric";
    feelsUnit.innerHTML = "°C";
    tempUnit.innerHTML = "°C";
    windUnit.innerHTML = "km/h";
  }

  searchCity(city, unitSystem);
}
let unitToggle = document.querySelector("#myCheckbox");
unitToggle.addEventListener("click", (event) => changeUnits(event));

//Degrees to Cardindal
function degreesToCardinal(degrees) {
  console.log(degrees);
  const sectors = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  const index = Math.round(degrees / 22.5) % 16;
  return sectors[index];
}

let unitSystem = "metric";

//Daily Forecast
function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return day;
}

function getForecast(city, units) {
  let apiKey = "a050491735e3o6daf6dd43f3ab206bct";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let highTodayElement = document.querySelector("#high");
  let lowTodayElement = document.querySelector("#low");
  let windUnit = document.querySelector("#wind-unit");

  highTodayElement.innerHTML = `${Math.round(
    response.data.daily[0].temperature.maximum
  )}°`;
  lowTodayElement.innerHTML = `${Math.round(
    response.data.daily[0].temperature.minimum
  )}°`;

  let forecastHtml = "";
  response.data.daily.forEach(function (day, index) {
    if (index >= 1 && index < 7) {
      forecastHtml =
        forecastHtml +
        `
    <div class="bottom-box-forecast">
        <p class="forecast-day">${formatForecastDay(day.time)}</p>
        <div class="forecast-inner-box">
          <img
            class="img-weather"
            src="${day.condition.icon_url}"
          />
          <p class="img-description">${day.condition.description}</p>
        </div>

        <div class="forecast-inner-box">
  
          <p class="forecast-temp">
            <span class="material-symbols-outlined red">thermometer</span
            ><span>${Math.round(day.temperature.maximum)}º</span
            ><span class="material-symbols-outlined blue">thermometer</span
            ><span>${Math.round(day.temperature.minimum)}º</span>
          </p>
        </div>
        <div class="forecast-inner-box">
          <p class="forecast-info">Humidity</p>
          <div class="humidity-gauge">
            <div class="humidity-gauge-body">
              <div class="humidity-gauge-fill"
              style="transform:rotate(${
                Math.round(day.temperature.humidity) * 1.75
              }deg)">
              </div>
              <div class="humidity-gauge-cover">${Math.round(
                day.temperature.humidity
              )}%</div>
            </div>
          </div>
        </div>
        <div class="forecast-inner-box">
          <p> 
          <span class="forecast-info">Wind</span>
          <span class="forecast-wind">${Math.round(day.wind.speed)}</span>
           <span id="forecast-wind-unit">${windUnit.innerHTML}</span>
           </p>
        </div>
      </div> `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

searchCity("Geiranger", unitSystem);
