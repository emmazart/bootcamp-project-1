console.log("script is working");

var flightApiUrl = "http://api.aviationstack.com/v1/flights?access_key=375139405fb38d47064313331615db30&flight_iata=UA2462";

fetch(flightApiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var flightData = data.data[0];
        console.log(flightData.flight_status);
        console.log(flightData.departure.airport);
        console.log(flightData.departure.terminal);
        console.log(flightData.departure.gate);
    });

// https://www.addictivetips.com/web/aviationstack-api-review/
