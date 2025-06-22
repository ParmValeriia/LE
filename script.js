const apiKey = "21f8c4c234cd480aaf5111440250106";
const citySelect = document.getElementById("citySelect");
let city = "Kyiv"
let d = true
const search = document.querySelector("#citySelect")

function fetchWeather(city, degrees) {
  fetch(`http://api.weatherapi.com/v1/forecast.json?key=21f8c4c234cd480aaf5111440250106&q=${city}&days=14&aqi=no&alerts=no`)
    .then(res => res.json())
    .then(data => {
      document.body.style.background = temperatureToColor(data.current.temp_c)
      document.querySelector(".switch-wrapper").style.background = temperatureToColor(data.current.temp_c)
      console.log(data)
      document.querySelector(".city").innerHTML = "Місто: " + data.location.name;
      document.querySelector(".temp").innerHTML = "<span>Температура: </span><span></span><span>" + (degrees ? (data.current.temp_c + "°C") : (data.current.temp_f + "°F")) + "</span>";
      document.querySelector(".cloud").innerHTML = "<span>Хмарність: </span><span></span><span>" + data.current.cloud + "%" + "</span>";
      document.querySelector(".windkph").innerHTML = "<span>Швидкість вітру: </span><span></span><span>" + data.current.wind_kph + " км/год" + "</span>";
      document.querySelector(".hamidity").innerHTML = "<span>Вологість: </span><span></span><span>" + data.current.humidity + "%" + "</span>";
      document.querySelector(".icon").setAttribute("src", "https:" + data.current.condition.icon);

      const forecastGrid = document.getElementById("forecastGrid");
      forecastGrid.innerHTML = ""; // очищення перед новим запитом

      data.forecast.forecastday.forEach(day => {
        const forecastEl = document.createElement("div");
        const temperature = degrees ? day.day.avgtemp_c + '°C' : day.day.avgtemp_f + '°F'
        forecastEl.className = "forecast-day";
        forecastEl.innerHTML = `
          <div class="date">${day.date}</div>
          <img src="https:${day.day.condition.icon}" alt="icon">
          <div> ${temperature}</div>
          <div>${day.day.condition.text}</div>
        `;
        forecastGrid.appendChild(forecastEl);
        $(".forecast-grid").slideUp()
      });
    })
    .catch(err => {
      alertify.defaults = {
        notifier: {
          delay: 5,
          position: 'top-right',
          closeButton: true,
          classes: {
            base: "alertify-notifier",
            prefix: "alertify-notifier"
          }
        }
      };

      alertify.error('Такого міста не існує!');
      console.error(err);
    });
}

// Ініціалізація з першого міста
fetchWeather("Kyiv", true);

// Слухач події зміни міста
citySelect.addEventListener("input", (e) => {
  // fetchWeather(e.target.value);
  fetch("http://api.weatherapi.com/v1/search.json?key=21f8c4c234cd480aaf5111440250106&q=" + e.target.value).then(res => res.json()).then(data => {
    document.querySelector("#city").innerHTML = ""
    data.forEach(c => {
      document.querySelector("#city").innerHTML += `<option value="${c.name}"></option>`

    })
  })
});

document.querySelector("#search").addEventListener("click", () => {
  city = citySelect.value
  fetchWeather(city, d);
})

search.addEventListener("submit", (e) => {
  e.preventDefault()
  fetchWeather(document.querySelector("#search").value);
});

// const citySearch = document.getElementById("citySearch");

// citySearch.addEventListener("change", () => {
//   const city = citySearch.value.trim();
//   if (city) {
//     fetchWeather(city);
//   }
// });


document.querySelector("#forecast").addEventListener("click", function () {
  $(".forecast-grid").slideToggle()
})


function temperatureToColor(temp) {
  const minTemp = -30;
  const maxTemp = 50;

  // Нормалізація: 0 (холод) → 1 (спека)
  let t = (temp - minTemp) / (maxTemp - minTemp);
  t = Math.max(0, Math.min(1, t)); // обмеження в межах [0, 1]

  // Пропорційне змішування кольору:
  const r = Math.round(255 * t);           // Червоний зростає
  const g = Math.round(255 * (1 - Math.abs(t - 0.5) * 2)); // Зелений максимум в середині
  const b = Math.round(255 * (1 - t));     // Синій спадає

  return `rgb(${r}, ${g}, ${b})`;
}

function updateLabel() {
  const toggle = document.getElementById('toggleColor').checked;
  document.getElementById('switchLabel').innerText = toggle ? "Цельсія" : "Фаренгейт";
  toggle ? fetchWeather(city, true) : fetchWeather(city, false)
  d = toggle
}



const settingsButton = document.querySelector(".settings");
const switchWrapper = document.querySelector(".switch-wrapper");

settingsButton.addEventListener("click", function () {
  // Перевіряємо поточний стан
  if (switchWrapper.style.display === "none" || switchWrapper.style.display === "") {
    switchWrapper.style.display = "block";
  } else {
    switchWrapper.style.display = "none";
  }
});

