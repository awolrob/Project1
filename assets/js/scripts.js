/* variables */
var searchBtn = document.getElementById("user-form");
// var searchState = document.getElementById("state");
var selectEl = document.getElementById("select-state");
var searchTerm;


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
// var map;
var mapArray = [];
// var markerName;
/* END VARIABLES*/


/* FUNCTIONS */

// //Handle search click
// searchClickHandler = function (event) {
//     event.preventDefault();
//     searchTerm = searchState.value.trim();
//     // console.log(searchTerm)
//     fNpsApi(searchTerm);
// };

fixLngData = function (longitude) {
    var correctedLongitude;
    if (longitude > 0) {
        correctedLongitude = longitude * -1;
    } else {
        correctedLongitude = longitude;
    }
    return correctedLongitude;
}

//call National Park Service API for state code selected
fNpsApi = function (stateIn) {
    var sNpsApi = 'https://developer.nps.gov/api/v1/campgrounds?' +
        'stateCode=' +
        stateIn +
        '&limit=700' +
        '&api_key=nNVtVCtPxYIdqgXcnAhfGjtCq9cW1SUGJ6AnV68u';
    aNPS = [];
    // Create a variable to hold the value of rating
    // var rating = document.querySelector('#rating').value;
    //  https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=nNVtVCtPxYIdqgXcnAhfGjtCq9cW1SUGJ6AnV68u

    //  add error checking - are there NO NPS campgrounds in the state you selected?

    fetch(sNpsApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            // console.log(response);
            if (response.total > 0) {
                // console.log("response total : ", response.total);
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
                        // console.log(infoHTML);
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
                // console.log("aNPS total : ", aNPS.length);
                updateMap(aNPS);
            } else {
                alert("Sorry, there are no National Park System campgrounds in the state of: " + stateIn)
            }
        }
        );
};

//initialize good map - first call through google maps "callback" parm
function initMap() {
    // myLatLng.lat = parseFloat(aNPS[0].latitude);
    // myLatLng.lng = parseFloat(aNPS[0].longitude);
    // debugger;
    map = new google.maps.Map(document.getElementById("map"), {
        // zoom: 4,
        // center: myLatLng,
    });
    //Load National Park Service click history data
    if (aNPSHistory) {
        updateMap(aNPSHistory);
    };

};

// function getMapCenter(centerIn) {
//     // console.log(jsonStateAbbr);
//     // debugger;
//     var latitude = "39.50";
//     var longitude = "-98.35";

//     function arrayMap() {
//         stateIndex = jsonStateAbbr.map(function (e) {
//             return e.abbv;
//         }).indexOf(centerIn);
//         // console.log("Index of 'state'  is = " + stateIndex);
//     }
//     arrayMap();

//     if (stateIndex === -1) {
//         //not state sent or not found - center map on USA
//         centerMap(parseFloat(latitude), parseFloat(longitude), 3);
//     } else {
//         centerMap(parseFloat(jsonStateAbbr[stateIndex].latitude), parseFloat(jsonStateAbbr[stateIndex].longitude), 4);
//     }
// };

// //Center map on state or USA
// function centerMap(lat, lng, zoomIn) {
//     myLatLng.lat = parseFloat(lat);
//     myLatLng.lng = parseFloat(lng);
//     //ugly first pass logic
//     if (map) {
//         map = new google.maps.Map(document.getElementById("map"), {
//             zoom: zoomIn,
//             center: myLatLng,
//         });
//     };
// };

function clearMarkers() {
    setMapOnAll(null);
};

var loadHistoryBtn = function () {
    $("#history").empty();
    if (aNPSHistory) {
        for (i = 0; i < aNPSHistory.length; i++) {
            // console.log(aNPSHistory[i].markerName);
            $("#history").append(
                $("<button>").addClass("").text(aNPSHistory[i].markerName)
            );
        }
    }
}


//save 10 click  history to history array
var saveHistoryData = function (aNPSIndex) {
    if (aNPSHistory.includes(aNPS[aNPSIndex])) { return };
    if (aNPSHistory.length > 9) {
        aNPSHistory.shift();
    }
    aNPSHistory.push(aNPS[aNPSIndex])
    localStorage.setItem("campClickSave", JSON.stringify(aNPSHistory));
    // debugger;
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
                // getweather(longitude,latitude);
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

/* MAIN LOGIC*/
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

var myfunction = function () {
    // console.log(selectEl.value);
    fNpsApi(selectEl.value);
}

if (aNPSHistory) {
    loadHistoryBtn();
};
// debugger;

// for(var i = 0; i < jsonStateAbbr.length; i++) {
//     var el = document.createElement("option");
//     el.textContent = jsonStateAbbr[i].state;
//     // el.textContent = jsonStateAbbr;
//     // el.value = jsonStateAbbr, "abbv";
//     select.appendChild(el);
// }​

// searchBtn.addEventListener("submit", searchClickHandler);
// Define Variables to hold Camp API data
//  location data, name data, long lat
// Define Variables to hold Weather API data
//  5-day forcast / future forecast (if available to free API usage)

//Define Variables to hold local storage search history
//Define Variables to hold random data to pass from API to API
// reformat dates, etc
// vars to capture user data - zip code and possibly date of trip
/* end variables */

/* Listeners */
//add listener for search button
//add listerer for history button array
/* End Listeners */

/* Functions */
//add function to call Camp API based on user input from search button

//add function to save successful search history (maybe add a message to click button to save?)

//add function to pull saved local storage

//add function to call Weather API

//add function to call Google Mapping API
/* End Functions */

/* Begin main logic */
// pull current date for default weather API call...
//check local storage for saved date - 
//  if it exists, loop through length calling 
//      load saved searches vars
//      append saved buttons
//
/* end main logic */
