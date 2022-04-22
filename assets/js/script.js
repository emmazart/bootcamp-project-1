
// ---------- DECLARE GLOBAL VARIALBES ---------- //

var flightDataArr = [];
var flightAlertArr = [];

var weatherHeader = document.querySelector("#city-name");
var weatherBtn = document.querySelector("#weather-button");
var weatherForm = document.querySelector("#weather-form");
var weatherInput = document.querySelector("#city");
var displayWeather = document.getElementById("display");

var airportHeader = document.querySelector("#airport-header");
var flightDiv = document.querySelector("#flight-populated");
var aviationForm = document.querySelector("#aviation-form");
var aviationInput = document.querySelector("#aviation-input");
var flightList = document.querySelector("#flight-list");
var flightApiKey = "ec6d6bb1f869f3011d43ed2a62fe53ae";

// ---------- FETCH CALL FOR AVIATION STACK API ---------- //

var flightSearch = function (flightInput) {
  var flightApiUrl = "http://api.aviationstack.com/v1/flights?access_key=" + flightApiKey + "&flight_iata=" + flightInput;

  fetch(flightApiUrl)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      var flightData = data.data[0];

      // if flightData exists
      if (flightData) {
        // declare variables for returned api data
        console.log("this is " + flightData);
        var status = flightData.flight_status;
        var airport = flightData.departure.airport;
        var terminal = flightData.departure.terminal;
        var gate = flightData.departure.gate;

        // get and format scheduled and estimated times of departure
        var scheduledData = new Date(flightData.departure.scheduled); 
        var scheduled = scheduledData.getUTCHours() + ":" + scheduledData.getUTCMinutes();
        var delay = flightData.departure.delay;
        var estimatedData = new Date(flightData.departure.estimated);
        var estimated = estimatedData.getUTCHours() + ":" + estimatedData.getUTCMinutes();

      } else {
      return invalidAvEntry();
      }

      // dynamically update header to include flight input
      airportHeader.innerHTML = `Flight # ${flightInput}`;

      // package flight data as objects
      var statusObj = {
        title: "Current Status: ",
        data: status,
      };

      var airportObj = {
        title: "Airport: ",
        data: airport,
      };

      var scheduledObj = {
        title: "Scheduled Departure: ",
        data: scheduled
      }

      var gateObj = {
        title: "Gate # ",
        data: gate,
      };

      flightDataArr = []; // reset flightData to empty array
      flightDataArr.push(airportObj, scheduledObj);

      // if there is a terminal value, then create an object and push to array
      if (terminal !== null) {
        var terminalObj = {
          title: "Terminal # ",
          data: terminal,
        };
        flightDataArr.push(terminalObj);
      }

      flightDataArr.push(gateObj, statusObj);
    
    // check for flight delays
    if (delay > 0) {

      // if there is a delay, package delay and estimated departure data
      var delayObj = {
          title: "Delayed: ",
          data: delay + " minutes"
      }    

      var estimatedObj = {
          title: "Estimated Departure: ",
          data: estimated
      }

      // push to new array for different formatting
      flightAlertArr.push(delayObj, estimatedObj);
    }
    })


    // ---------- POPULATE PAGE WITH FLIGHT DATA ---------- //
    .then(function () {

      // for loop for basic flight data
      for (var d of flightDataArr) {
        console.log(d);
        var flightLi = document.createElement("li");
        flightLi.innerHTML =
          "<li>" + d.title + "<span>" + d.data + "</span></li>";
        flightList.appendChild(flightLi);
      }

      // for of loop for alert flight data
      for (var d of flightAlertArr){
        var flightLi = document.createElement("li");
        flightLi.innerHTML = "<li>" + d.title + "<span>" + d.data + "</span></li>";
        flightLi.classList = "bg-red-500 text-white p-1";
        flightList.appendChild(flightLi);
      }
    });
};

// event listener for aviation form
aviationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // reset form header if necessary
  let formEl = document.getElementById("aviation-header");
  formEl.classList = "text-xl text-center";
  formEl.textContent = "Enter Your Fight Number";

  flightList.innerHTML = ""; 

  // validate flight input
  var flightInput = aviationInput.value;
  if (flightInput === "") {
    invalidAvEntry();
  } else {
    localStorage.setItem("flight", flightInput); // set or replace localstorage
    flightSearch(flightInput);
  }

  aviationInput.value = ""; // clear textarea input
});

// ---------- OPEN WEATHER API ---------- //

// ---------- variables for open weather fetch call ---------- //
var APIKey = "0c390c97a57230e6547b396d84ff33a8";
let dailyWeather;

// ---------- DEFINE WEATHER DISPLAY FUNCTION TO PRINT DATA TO PAGE ---------- //
function weatherDisplay() {
  for (i = 0; i < 5; i++) {
    const dw = dailyWeather[i];
    const DailyEl = document.createElement("div");
    var date = new Date(dw.dt * 1000).toLocaleDateString();
    var temp = Math.round(dw.temp.day) + " °F";
    var wind = "Wind: " + dw.wind_speed + " MPH";
    var humidity = "Humidity: " + dw.humidity + " %";
    var icon = dw.weather[0].icon;


    DailyEl.innerHTML = `<strong>${date}</strong> 
      <img src="https://openweathermap.org/img/wn/${icon}.png">
      ${temp} </br> ${wind} </br> ${humidity}`;
    DailyEl.classList = "flex justify-evenly bg-blue-100 text-center rounded p-1 m-2";

    displayWeather.appendChild(DailyEl);
  }
}

// ---------- WEATHER SEARCH API CALL ---------- //
function weatherSearch(cityName) {

  // format user input to capitalize first letter
  var input = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  weatherHeader.textContent = input;
  var latLongAPI = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;

  // fetch call
  fetch(latLongAPI)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then((data) => {
      const lat = data[0].lat;
      const lon = data[0].lon;
      allWeatherApi(lat, lon);
    })
    .catch((error) => {
      // Handle the error
      invalidWeatherEntry();
      console.log(error);
    });
}

// ---------- FUNCTION FOR LAT/LON API CALL ---------- //
var allWeatherApi = function (lat, lon) {
  const weatherAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + APIKey + "&units=imperial";
  
  fetch(weatherAPI).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        dailyWeather = data.daily;
        weatherDisplay();
        console.log(data);
      });
    }
  });
};

// event listener for weather form
weatherForm.addEventListener("submit", function(event){
    event.preventDefault();

    // reset form header if necessary
    let formEl = document.getElementById("weather-header");
    formEl.classList = "text-xl text-center";
    formEl.textContent = "Enter Your Destination City";

    displayWeather.innerHTML = "";

    var cityName = weatherInput.value
    localStorage.setItem("city", cityName);
    weatherSearch(cityName);

    weatherInput.value = ""; // clear textarea
});

//When the flightData returns empty.
//This the result of a bad entry in the aviation text field

// ---------- INVALID ENTRY FUNCTIONS ---------- //
var invalidAvEntry = function () {
  let formEl = document.getElementById("aviation-header");
  formEl.classList = "bg-red-200 text-2xl text-center";
  formEl.textContent = "Please Enter a Valid Fight Number!!";
  // localStorage.clear();
  // flightDiv.innerHTML = "Invalid Flight";
};

var invalidWeatherEntry = function () {
  // console.log(error);
  let formEl = document.getElementById("weather-header");
  formEl.classList = "bg-red-200 text-2xl text-center";
  formEl.textContent = "Please Enter a Valid City!!";
  // weatherHeader.textContent = "";
};

// ---------- LOCAL STORAGE CHECKER ---------- //
var checkLocalStorage = function() {

    // define variables to hold local storage values
    var lsWeather = localStorage.getItem("city");
    var lsFlight = localStorage.getItem("flight");

    // if lsWeather exists, run the weatherSearch function & pass through value
    if (lsWeather) {
      weatherSearch(lsWeather);
    }

    // if lsFlight exists, run the flightSearch function & pass through value
    if (lsFlight) {
      flightList.innerHTML = "";
      flightSearch(lsFlight);
    }
};

// ---------- CALL LOCAL STORAGE CHECKER ON PAGE LOAD ---------- //
checkLocalStorage();
