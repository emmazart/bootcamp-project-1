console.log("script is working");

// ---------- DECLARE GLOBAL VARIALBES ---------- //

var flightDataArr = [];


// ---------- FETCH CALL FOR AVIATION STACK API ---------- //

var flightApiUrl = "http://api.aviationstack.com/v1/flights?access_key=375139405fb38d47064313331615db30&flight_iata=UA2462";

fetch(flightApiUrl)
    .then(function(response) {
        return response.json();
    })
    // declare variables for returned api data
    .then(function(data) {
        var flightData = data.data[0];
        var status = flightData.flight_status;
        var airport = flightData.departure.airport;
        var terminal = flightData.departure.terminal;
        var gate = flightData.departure.gate;

        var statusObj = {
            title: "Current Status: ",
            data: status
        };

        var airportObj = {
            title: "Airport: ",
            data: airport
        };

        var terminalObj = {
            title: "Terminal # ",
            data: terminal
        };

        var gateObj = {
            title: "Gate # ",
            data: gate
        };

        flightDataArr.push(airportObj, terminalObj, gateObj, statusObj);
    })
    .then(function(){
        var flightList = document.querySelector("#flight-list");

        for (var d of flightDataArr){
            console.log(d);
            var flightLi = document.createElement("li");
            flightLi.innerHTML = "<li>" + d.title + "<span>" + d.data + "</span></li>";
            flightList.appendChild(flightLi);
        }

    })

// https://www.addictivetips.com/web/aviationstack-api-review/
