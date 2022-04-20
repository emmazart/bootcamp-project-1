
// ---------- DECLARE GLOBAL VARIALBES ---------- //

var flightDataArr = [];
var flightAlertArr = [];

var weatherHeader = document.querySelector("#city-name");
var weatherBtn = document.querySelector("#weather-button");
var weatherForm = document.querySelector("#weather-form");
var weatherInput = document.querySelector("#city");
var displayWeather = document.getElementById("display");

var aviationForm = document.querySelector("#aviation-form");
var aviationInput = document.querySelector("#aviation-input");
var flightList = document.querySelector("#flight-list");

// ---------- FETCH CALL FOR AVIATION STACK API ---------- //

var flightSearch = function(flightInput) {
    var flightApiUrl = "http://api.aviationstack.com/v1/flights?access_key=2796b40407c851651a91def1ed285299&flight_iata=" + flightInput;

    fetch(flightApiUrl)
        .then(function(response) {
            return response.json();
        })

        .then(function(data) {

            // declare variables for returned api data
            var flightData = data.data[0];
            console.log(flightData);
            var status = flightData.flight_status;

            // get and format scheduled and estimated times of departure
            var scheduledData = new Date(flightData.departure.scheduled); 
            var scheduled = scheduledData.getUTCHours() + ":" + scheduledData.getUTCMinutes();
            var delay = flightData.departure.delay;
            var estimatedData = new Date(flightData.departure.estimated);
            var estimated = estimatedData.getUTCHours() + ":" + estimatedData.getUTCMinutes();
            
            var airport = flightData.departure.airport;
            var terminal = flightData.departure.terminal;
            var gate = flightData.departure.gate;

            // package all data into objects
            var statusObj = {
                title: "Current Status: ",
                data: status
            };

            var airportObj = {
                title: "Airport: ",
                data: airport
            };

            var scheduledObj = {
                title: "Scheduled Departure: ",
                data: scheduled
            }

            var gateObj = {
                title: "Gate # ",
                data: gate
            };

            flightDataArr = []; // reset flightData to empty array
            flightDataArr.push(airportObj, scheduledObj);

            // if there is a terminal value, then create an object and push to array
            if (terminal !== null) {
                var terminalObj = {
                    title: "Terminal # ",
                    data: terminal
                };    
                flightDataArr.push(terminalObj);
            } 
            else {
                console.log("no terminal");
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
        .then(function(){

            // for of loop for basic flight data
            for (var d of flightDataArr){
                var flightLi = document.createElement("li");
                flightLi.innerHTML = "<li>" + d.title + "<span>" + d.data + "</span></li>";
                flightList.classList = "py-1";
                flightList.appendChild(flightLi);
            }

            // for of loop for alert flight data
            for (var d of flightAlertArr){
                var flightLi = document.createElement("li");
                flightLi.innerHTML = "<li>" + d.title + "<span>" + d.data + "</span></li>";
                flightLi.classList = "bg-red-500 text-white p-1";
                flightList.appendChild(flightLi);
            }

        })
}

// event listener for aviation form
aviationForm.addEventListener("submit", function(event){
        event.preventDefault();

        flightList.innerHTML = "";

        var flightInput = aviationInput.value;
        localStorage.setItem("flight", flightInput); // set or replace localstorage
        flightSearch(flightInput);
    
        aviationInput.value = ""; // clear textarea input
});

// ---------- OPEN WEATHER API ---------- //

// ---------- variables for open weather fetch call ---------- //
var APIKey = "dc591a53f8e7a96b2703399147c86ba9"
let dailyWeather;

// ---------- DEFINE WEATHER DISPLAY FUNCTION TO PRINT DATA TO PAGE ---------- //
function weatherDisplay() {
     for (i=0; i < 5; i++) {
         const dw = dailyWeather[i];
         //icon?//
         const DailyEl = document.createElement("div");
             var date = new Date(dw.dt*1000).toLocaleDateString();
             var temp = Math.round(dw.temp.day) + " °F";
             var wind = "Wind: " + dw.wind_speed + " MPH";
             var humidity = "Humidity: " + dw.humidity + " %";
             var icon = dw.weather[0].icon;


        DailyEl.innerHTML = `<strong>${date}</strong> 
            <img src="http://openweathermap.org/img/wn/${icon}.png">
            ${temp} </br> ${wind} </br> ${humidity}`;
        DailyEl.classList = "flex justify-evenly bg-blue-100 text-center rounded p-1 m-2";

        displayWeather.appendChild(DailyEl);
    };
}

// ---------- WEATHER SEARCH API CALL ---------- //
function weatherSearch(cityName) {

    // format user input to capitalize first letter
    var input = cityName.charAt(0).toUpperCase() + cityName.slice(1)
    weatherHeader.textContent = input;
    var latLongAPI = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;

    // fetch call
    fetch(latLongAPI).then(function(response){
        if (response.ok){
            response.json().then(function(data) {
                const lat = data [0].lat;
                const lon = data [0].lon;
                const weatherAPI = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon=" + lon +"&exclude=minutely,hourly&appid="+ APIKey + "&units=imperial";
                console.log(data);
                fetch(weatherAPI).then(function(response) {
                    if (response.ok) {
                        response.json().then(function(data) {
                            dailyWeather = data.daily;
                            weatherDisplay();
                            console.log(data);
                        });
                    }
                })
            });
        }
    })

};

// event listener for weather form
weatherForm.addEventListener("submit", function(event){
    event.preventDefault();

    displayWeather.innerHTML = "";

    var cityName = weatherInput.value
    localStorage.setItem("city", cityName);
    weatherSearch(cityName);

    weatherInput.value = ""; // clear textarea
});


// ---------- LOCAL STORAGE CHECKER ---------- //
var checkLocalStorage = function() {

    // define variables to hold local storage values
    var lsWeather = localStorage.getItem("city");
    var lsFlight = localStorage.getItem("flight");

    // if lsWeather exists, run the weatherSearch function & pass through value
    if (lsWeather) {
        weatherSearch(lsWeather);
    } else {
        console.log("city not in localstorage");
    }

    // if lsFlight exists, run the flightSearch function & pass through value
    if (lsFlight) {
        flightList.innerHTML = "";
        flightSearch(lsFlight);
    } else {
        console.log("flight not in localstorage")
    }
};

// ---------- CALL LOCAL STORAGE CHECKER ON PAGE LOAD ---------- //
checkLocalStorage();