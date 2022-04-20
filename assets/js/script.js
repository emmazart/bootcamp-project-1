console.log("script is working");

// ---------- DECLARE GLOBAL VARIALBES ---------- //

var flightDataArr = [];

var weatherHeader = document.querySelector("#city-name");
var weatherBtn = document.querySelector("#weather-button");
var weatherForm = document.querySelector("#weather-form");
var weatherInput = document.querySelector("#city");
var displayWeather = document.getElementById("display");

var aviationForm = document.querySelector("#aviation-form");
var aviationInput = document.querySelector("#aviation-input");
var flightList = document.querySelector("#flight-list");

// ---------- FETCH CALL FOR AVIATION STACK API ---------- //

// var flightSearch = function (flightInput) {
//   var flightApiUrl =
//     "http://api.aviationstack.com/v1/flights?access_key=efa78e00290b9cfa56fe3335158ce24d&flight_iata=" +
//     flightInput;
//   console.log(flightApiUrl);

//   fetch(flightApiUrl)
//     .then(function (response) {
//       console.log(response.status);
//       console.log(response.ok);
//       return response.json();
//     })
//     // declare variables for returned api data
//     .then(function (data) {
//         var flightData = data.data[0];
//       if (flightData) {
//         console.log("this is " + data.data);
//         var status = flightData.flight_status;
//         var airport = flightData.departure.airport;
//         var terminal = flightData.departure.terminal;
//         var gate = flightData.departure.gate;
//       } else {
//         invalidAvEntry();
//       }

//       var statusObj = {
//         title: "Current Status: ",
//         data: status,
//       };

//       var airportObj = {
//         title: "Airport: ",
//         data: airport,
//       };

//       var gateObj = {
//         title: "Gate # ",
//         data: gate,
//       };

//       flightDataArr = [];
//       flightDataArr.push(airportObj);

//       if (terminal !== null) {
//         var terminalObj = {
//           title: "Terminal # ",
//           data: terminal,
//         };
//         flightDataArr.push(terminalObj);
//       } else {
//         console.log("no terminal");
//       }

//       flightDataArr.push(gateObj, statusObj);
//     })
//     .then(function () {
//       for (var d of flightDataArr) {
//         console.log(d);
//         var flightLi = document.createElement("li");
//         flightLi.innerHTML =
//           "<li>" + d.title + "<span>" + d.data + "</span></li>";
//         flightList.appendChild(flightLi);
//       }
//     });
// };

aviationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  flightList.innerHTML = "";

  var flightInput = aviationInput.value;
  //   flightSearch(flightInput);

  aviationInput.value = "";
});

// https://www.addictivetips.com/web/aviationstack-api-review/

//weather stack//

//button weathersearch function//
// var APIKey = "dc591a53f8e7a96b2703399147c86ba9";
var APIKey = "0c390c97a57230e6547b396d84ff33a8";
let dailyWeather;

function weatherDisplay() {
  for (i = 0; i < 5; i++) {
    const dw = dailyWeather[i];
    //icon?//
    const DailyEl = document.createElement("div");
    var date = new Date(dw.dt * 1000).toLocaleDateString();
    var temp = Math.round(dw.temp.day) + " °F";
    var wind = "Wind: " + dw.wind_speed + " MPH";
    var humidity = "Humidity: " + dw.humidity + " %";
    var icon = dw.weather[0].icon;

    DailyEl.innerHTML = `<strong>${date}</strong> 
            <img src="http://openweathermap.org/img/wn/${icon}.png">
            ${temp} </br> ${wind} </br> ${humidity}`;
    DailyEl.classList =
      "flex justify-evenly bg-blue-100 text-center rounded p-1 m-2";

    displayWeather.appendChild(DailyEl);
  }
}

function weatherSearch(cityName) {
  // format user input to capitalize first letter
  var input = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  weatherHeader.textContent = input;
  var latLongAPI =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&appid=" +
    APIKey;

  fetch(latLongAPI)
    .then((response) => {
    if (response.status >= 200 && response.status <= 299) {
        console.log(response.json());
        // return response.json();
    } else {
        throw Error(response.statusText);
    }
    })
    .then((data) => {
        const lat = data[0].lat;
        const lon = data[0].lon;
        allWeatherApi(lat, lon);

    //     const weatherAPI =
    //       "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    //       lat +
    //       "&lon=" +
    //       lon +
    //       "&exclude=minutely,hourly&appid=" +
    //       APIKey +
    //       "&units=imperial";
    //     console.log(data);
    // fetch(weatherAPI).then(function (response) {
    //       if (response.ok) {
    //         response.json().then(function (data) {
    //           dailyWeather = data.daily;
    //           weatherDisplay();
    //           console.log(data);
    //         });
    //       }
    //     });
      })
    .catch((error) => {
    // Handle the error
    invalidWeatherEntry(error);
    console.log(error);
    });
var allWeatherApi = function(lat, lon) {
    const weatherAPI =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&exclude=minutely,hourly&appid=" +
          APIKey +
          "&units=imperial";
        console.log(data);
    fetch(weatherAPI).then(function (response) {
          if (response.ok) {
            response.json().then(function (data) {
              dailyWeather = data.daily;
              weatherDisplay();
              console.log(data);
            });
          }
        });
}

weatherForm.addEventListener("submit", function (event) {
  event.preventDefault();

  displayWeather.innerHTML = "";

  var cityName = weatherInput.value;
  weatherSearch(cityName);

  weatherInput.value = "";
});
};
//When the flightData returns empty.
//This the result of a bad entry in the aviation text field

var invalidAvEntry = function () {
  let formEl = document.getElementById("aviation-header");
  let invalidEntry = document.createElement("h2");
  invalidEntry.textContent = "Please Enter a Valid Flight Number!!";
  formEl.replaceWith(invalidEntry);
};
var invalidWeatherEntry = function (error) {
    console.log(error);
  let formEl = document.getElementById("weather-header");
  let invalidEntry = document.createElement("h2");
  invalidEntry.textContent = "Please Enter a Valid City!!";
  formEl.replaceWith(invalidEntry);
};
invalidAvEntry();

// var errorHandler = function () {
//   if (response.status >= 200 && response.status <= 299) {
//     return response.json();
//   } else {
//     throw Error(response.statusText);
//   }
