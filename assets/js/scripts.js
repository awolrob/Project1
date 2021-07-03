var searchBtn = document.getElementById("user-form");
var searchState = document.getElementById("state");
var searchTerm;

//National Park Service API Variables
var aNPS = [
    {
        markerName: "center",
        latitude: "41.38855173798833",
        longitude: "-82.21036065433786",
    }
];

// Google Maps API Variables
var myLatLng = { lat: 0, lng: 0 };
var map;
var markerName;

/* FUNCTIONS */

//Handle search click
searchClickHandler = function (event) {
    event.preventDefault();
    searchTerm = searchState.value.trim();
    console.log(searchTerm)
    fNpsApi();
};

//call National Park Service API for state code selected
fNpsApi = function () {
    var sNpsApi = 'https://developer.nps.gov/api/v1/campgrounds?' +
        'stateCode=' +
        searchTerm +
        '&limit=500' +
        '&api_key=nNVtVCtPxYIdqgXcnAhfGjtCq9cW1SUGJ6AnV68u';

    // Create a variable to hold the value of rating
    // var rating = document.querySelector('#rating').value;
    //  https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=nNVtVCtPxYIdqgXcnAhfGjtCq9cW1SUGJ6AnV68u

    //  add error checking - are there NO NPS campgrounds in the state you selected?

    fetch(sNpsApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            aNPS[0].markerName = response.data[0].name;
            aNPS[0].latitude = response.data[0].latitude;
            aNPS[0].longitude = response.data[0].longitude;

            for (i = 1; i < response.data.length; i++) {
                aNPS.push({
                    markerName: response.data[i].name,
                    latitude: response.data[i].latitude,
                    longitude: response.data[i].longitude,
                })
            }
            updateMap();
        }
        );

}

searchBtn.addEventListener("submit", searchClickHandler);
/* variables */
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
