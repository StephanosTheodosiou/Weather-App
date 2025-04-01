const apiKey = "39562f571728291c4e5f185d6f076ef0";
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const toggleBtn = document.getElementById("toggle-unit");

let currentTempCelsius = null;
let isCelsius = true;

searchBtn.addEventListener("click", () => {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
        fetchForecast(city); // Optional: just logs 5-day forecast
    }
    cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const city = cityInput.value;
          if (city) {
            fetchWeather(city);
            fetchForecast(city);
          }
        }
      });
      
});

toggleBtn.addEventListener("click", () => {
    if (currentTempCelsius !== null) {
        isCelsius = !isCelsius;
        const temp = isCelsius
            ? currentTempCelsius
            : (currentTempCelsius * 9) / 5 + 32;
        const unit = isCelsius ? "C" : "F";
        document.getElementById("temperature").textContent = `${Math.round(temp)}°${unit}`;
    }
});

async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();

        if (data.cod === 200) {
            currentTempCelsius = data.main.temp;
            updateWeatherUI(data);
        } else {
            alert("City not found!");
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

function updateWeatherUI(data) {
    document.getElementById("city-name").textContent = data.name;
    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("weather-description").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `Wind: ${data.wind.speed} km/h`;

    const iconCode = data.weather[0].icon;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const body = document.body;
    if (data.weather[0].main === "Clear") body.className = "sunny";
    else if (data.weather[0].main === "Rain") body.className = "rainy";
    else body.className = "cloudy";
}

// Optional: fetch forecast data (currently logs it)
function fetchForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => console.log(data.list))
        .catch(error => console.error("Forecast fetch error:", error));
}

// On load, try geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            )
                .then(response => response.json())
                .then(data => {
                    currentTempCelsius = data.main.temp;
                    updateWeatherUI(data);
                });
        },
        error => alert("Geolocation blocked. Please enable it or search manually.")
    );
}
document.getElementById("year").textContent = new Date().getFullYear();
