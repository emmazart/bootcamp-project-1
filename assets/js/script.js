console.log("script is working");

// ---------- DECLARE GLOBAL VARIALBES ---------- //

var flightDataArr = [];
var weatherHeader = document.querySelector("#city-name");


// ---------- FETCH CALL FOR AVIATION STACK API ---------- //

// var flightApiUrl = "http://api.aviationstack.com/v1/flights?access_key=375139405fb38d47064313331615db30&flight_iata=UA2462";

// fetch(flightApiUrl)
//     .then(function(response) {
//         return response.json();
//     })
//     // declare variables for returned api data
//     .then(function(data) {
//         var flightData = data.data[0];
//         var status = flightData.flight_status;
//         var airport = flightData.departure.airport;
//         var terminal = flightData.departure.terminal;
//         var gate = flightData.departure.gate;

//         var statusObj = {
//             title: "Current Status: ",
//             data: status
//         };

//         var airportObj = {
//             title: "Airport: ",
//             data: airport
//         };

//         var terminalObj = {
//             title: "Terminal # ",
//             data: terminal
//         };

//         var gateObj = {
//             title: "Gate # ",
//             data: gate
//         };

//         flightDataArr.push(airportObj, terminalObj, gateObj, statusObj);
//     })
//     .then(function(){
//         var flightList = document.querySelector("#flight-list");

//         for (var d of flightDataArr){
//             console.log(d);
//             var flightLi = document.createElement("li");
//             flightLi.innerHTML = "<li>" + d.title + "<span>" + d.data + "</span></li>";
//             flightList.appendChild(flightLi);
//         }

//     })

// https://www.addictivetips.com/web/aviationstack-api-review/


//weather stack//



//button weathersearch function//
var APIKey = "dc591a53f8e7a96b2703399147c86ba9"
let dailyWeather;


function weatherDisplay() {
    const displayWeather = document.getElementById("display");
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



function weatherSearch(event) {
    event.preventDefault();
    var cityName = document.getElementById("city").value

    // format user input to capitalize first letter
    var input = cityName.charAt(0).toUpperCase() + cityName.slice(1)
    weatherHeader.textContent = input;
    var latLongAPI = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + APIKey;

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
