const apiKey = "21f8c4c234cd480aaf5111440250106";
const citySelect = document.getElementById("citySelect");

function fetchWeather(city) {
  fetch(`http://api.weatherapi.com/v1/forecast.json?key=21f8c4c234cd480aaf5111440250106&q=${city}&days=14&aqi=no&alerts=no`)
    .then(res => res.json())
    .then(data => {
        
      document.querySelector(".city").textContent = "Місто: " + data.location.name;
      document.querySelector(".temp").textContent = "Температура: " + data.current.temp_c + "°C";
      document.querySelector(".cloud").textContent = "Хмарність: " + data.current.cloud + "%";
      document.querySelector(".windkph").textContent = "Швидкість вітру: " + data.current.wind_kph + " км/год";
      document.querySelector(".hamidity").textContent = "Вологість: " + data.current.humidity + "%";
      document.querySelector(".icon").setAttribute("src", "https:" + data.current.condition.icon);

      const forecastGrid = document.getElementById("forecastGrid");
      forecastGrid.innerHTML = ""; // очищення перед новим запитом

      data.forecast.forecastday.forEach(day => {
        const forecastEl = document.createElement("div");
        forecastEl.className = "forecast-day";
        forecastEl.innerHTML = `
          <div class="date">${day.date}</div>
          <img src="https:${day.day.condition.icon}" alt="icon">
          <div>${day.day.avgtemp_c}°C</div>
          <div>${day.day.condition.text}</div>
        `;
        forecastGrid.appendChild(forecastEl);
      });
    })
    .catch(err => {
      alert("Помилка отримання погоди!");
      console.error(err);
    });
}

// Ініціалізація з першого міста
fetchWeather(citySelect.value);

// Слухач події зміни міста
citySelect.addEventListener("change", () => {
  fetchWeather(citySelect.value);
});