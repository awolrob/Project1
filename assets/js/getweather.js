var getCurWeather = function (lat, lng) {
    var apiUrlonecall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +
        "&lon=" + lng +
        "&exclude=minutely,hourly,alerts" +
        "&units=imperial" +
        "&appid=f0fb5a2fd74295d57b15c5c4bd25d82f";
    fetch(apiUrlonecall)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    loadUI(data.current, data.daily);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Open Weather Map API One Call");
        });

};