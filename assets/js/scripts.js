/* variables */

var searchBtn = document.getElementById("user-form");
var selectEl = document.getElementById("select-state");
var searchTerm;
var weatherLine = "";

//National Park Service API Variables
// center of the USA
var aNPS = [
    {
        markerName: "center",
        latitude: "39.50",
        longitude: "-98.35",
        description: ""
    }
];

//National Park Service click history data
var aNPSHistory = JSON.parse(localStorage.getItem('campClickSave')) || [];
//     markerName: "center",
//     latitude: "39.50",
//     longitude: "-98.35",
//     description: ""

// Google Maps API Variables
var myLatLng = { lat: 0, lng: 0 };
var mapArray = [];

/* END VARIABLES*/


/* FUNCTIONS */
closeModal = function (event) {
    var target = $("#error-modal");
    $(target).removeClass("is-active");
}

//correct longitude data for some locations in the NPS data
fixLngData = function (longitude) {
    var correctedLongitude;
    if (longitude > 0) {
        correctedLongitude = longitude * -1;
    } else {
        correctedLongitude = longitude;
    }
    return correctedLongitude;
};


//call National Park Service API for state code selected
fNpsApi = function (stateIn) {
    var sNpsApi = 'https://developer.nps.gov/api/v1/campgrounds?' +
        'stateCode=' +
        stateIn +
        '&limit=700' +
        '&api_key=nNVtVCtPxYIdqgXcnAhfGjtCq9cW1SUGJ6AnV68u';
    aNPS = [];
    //  https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=nNVtVCtPxYIdqgXcnAhfGjtCq9cW1SUGJ6AnV68u

    fetch(sNpsApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            if (response.total > 0) {
                // create seperate index to count good api records read
                var iGoodDataIndex = -1;
                for (i = 0; i < response.data.length; i++) {
                    if (response.data[i].latLong > "") {
                        iGoodDataIndex = iGoodDataIndex + 1;
                        var image;
                        if (typeof response.data[i].images[0] === "undefined") {
                            image = ""
                        } else {
                            image = "</br></br><img style=width:200px; src=' " +
                                response.data[i].images[0].url +
                                "' </img>"
                        };

                        // create variable to hold infowindow description
                        var descText;

                        if (response.data[i].audioDescription === "") {
                            descText = response.data[i].description
                        } else {
                            descText = response.data[i].audioDescription
                        }
                        var infoHTML = "<h1 id='infoWindowData' data-index='" +
                            iGoodDataIndex +
                            "'><strong>" +
                            response.data[i].name +
                            "</strong></h1>" + "</br><p>" +
                            descText +
                            "</p>" +
                            image;

                        // save good record to NPS array
                        aNPS.push(
                            {
                                markerName: response.data[i].name,
                                latitude: response.data[i].latitude,
                                longitude: fixLngData(response.data[i].longitude),
                                description: infoHTML
                            }
                        )
                    }
                }
                updateMap(aNPS);

            } else {
                var target = $("#error-modal");
                $(target).addClass("is-active");
            }
        }
        );
};

//initialize good map - first call through google maps "callback" parm
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        // zoom: 4,
        // center: myLatLng,
    });
    //Load National Park Service click history data to map and set bounds to location max
    if (aNPSHistory) {
        updateMap(aNPSHistory);
    };

};

// reload history button and refresh api data
var loadHistoryBtn = function () {
    $("#history").empty();
    if (aNPSHistory) {
        for (i = 0; i < aNPSHistory.length; i++) {
            getCurWeather(aNPSHistory[i].latitude, aNPSHistory[i].longitude, aNPSHistory[i].markerName);
        }
    }
}

//save 10 click  history to history array
var saveHistoryData = function (aNPSIndex) {
    if (aNPSHistory.includes(aNPS[aNPSIndex])) { return };

    if (aNPSHistory.length > 19) {
        //FIFO
        aNPSHistory.shift();
    }

    aNPSHistory.push(aNPS[aNPSIndex])
    localStorage.setItem("campClickSave", JSON.stringify(aNPSHistory));
    loadHistoryBtn();
};

// update google map with the passing object to loop through and drop markers
function updateMap(objectIn) {
    var image = "./assets/images/clipart2984201.png";
    //Create LatLngBounds object.
    var latlngbounds = new google.maps.LatLngBounds();


    //create a new map and center on state or country
    // getMapCenter(centerOn);
    // centerMap(parseFloat(objectIn[0].latitude), parseFloat(objectIn[0].longitude), 5);

    // myLatLng.lat = parseFloat(objectIn[0].latitude);
    // myLatLng.lng = parseFloat(objectIn[0].longitude);
    // const map = new google.maps.Map(document.getElementById("map"), {
    //     zoom: 5,
    //     center: myLatLng,
    // });
    // new google.maps.Marker({
    //     position: myLatLng,
    //     map,
    //     title: aNPS[0].markerName,
    // });

    for (i = 0; i < objectIn.length; i++) {
        myLatLng.lat = parseFloat(objectIn[i].latitude);
        myLatLng.lng = parseFloat(objectIn[i].longitude);
        // console.log(markerName = aNPS[i].markerName + " lat: " + parseFloat(objectIn[i].latitude) + " lng: " + parseFloat(objectIn[i].longitude));
        // window.setTimeout(() => {
        // add info window?  https://developers.google.com/maps/documentation/javascript/examples/infowindow-simple

        const marker = new google.maps.Marker({
            position: myLatLng,
            map,
            title: objectIn[i].markerName,
            icon: image,
            animation: google.maps.Animation.DROP,
        });

        // infowindow.close();

        const infowindow = new google.maps.InfoWindow({
            content: objectIn[i].description,
            maxWidth: 200,
        });

        // console.log(objectIn[i].description);

        marker.addListener("click", () => {
            if (typeof lastInfoWindow === "undefined") {
            } else {
                lastInfoWindow.close();
            }
            // console.log("marker on click: ", marker);
            infowindow.open({
                anchor: marker,
                map,
                shouldFocus: false,
            });
        });

        google.maps.event.addListener(infowindow, 'domready', function () {
            // $(".btn-site").on('click', function(e) {
            // console.log('dom ready');
            // console.log(document.getElementById("infoWindowData").getAttribute("data-index"));
            // console.log("infoWindow Data ", document.getElementById("infoWindowData"));
            saveHistoryData(document.getElementById("infoWindowData").getAttribute("data-index"))
            lastInfoWindow = infowindow;
            // });  
        });




        latlngbounds.extend(myLatLng)
        // }, 50);
    }
    //Get the boundaries of the Map.
    var bounds = new google.maps.LatLngBounds();

    //Center map and adjust Zoom based on the position of all markers.
    map.setCenter(latlngbounds.getCenter());
    map.fitBounds(latlngbounds);

}


//List current weather conditions on each clicked location
var getCurWeather = function (lat, lng, parkname) {

    var apiUrlonecall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +
        "&lon=" + lng +
        "&exclude=minutely,hourly,alerts" +
        "&units=imperial" +
        "&appid=f0fb5a2fd74295d57b15c5c4bd25d82f";

    fetch(apiUrlonecall)
        .then(function (response) {
            // request was successful
            console.log(response);
            if (response.ok) {
                response.json().then(function (data) {
                    weatherLine = "Current Conditions: Temp: " +
                        data.current.temp + ' °F  |  ' +
                        "Wind: " + data.current.wind_speed + " MPH  |  " +
                        "Humidity: " + data.current.humidity + " %";
                    $("#history").append(
                        $("<button class='history-data'>").addClass("").text(parkname)
                    );

                    // console.log(weatherLine);

                    $("#history").append(
                        $("<p>").addClass("").text(weatherLine));

                });
            } else {
                // alert("Error: " + response.statusText);
            }
        }
        )
        .catch(function (error) {
            // alert("Unable to connect to Open Weather Map API One Call");
        }
        )
};

/* MAIN LOGIC*/
var myfunction = function () {
    // console.log(selectEl.value);
    fNpsApi(selectEl.value);
}

//Center map in US//
// centerMap(parseFloat(aNPS[0].latitude), parseFloat(aNPS[0].longitude), 4);

//Call NPS API for all sites in the US
// fNpsApi("NV");

// getMapCenter();



// console.log(selectEl)

for (var i = 0; i < jsonStateAbbr.length; i++) {
    // console.log(i)
    var newOption = document.createElement("option");
    newOption.textContent = jsonStateAbbr[i].state;
    newOption.setAttribute("value", jsonStateAbbr[i].abbv);
    selectEl.appendChild(newOption)
    // console.log(newOption);
}

// selectEl.addEventListener("select", console.log("here"), false);

if (aNPSHistory) {
    loadHistoryBtn();
};