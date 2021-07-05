function fNpsApi() {
    // var searchTerm = document.querySelector('#searchTerm').value;

    var searchTerm = 'CA';
    var sNpsApi = 'https://developer.nps.gov/api/v1/campgrounds?' +
        'stateCode=' +
        searchTerm +
        '&limit=500' +
        '&api_key=nNVtVCtPxYIdqgXcnAhfGjtCq9cW1SUGJ6AnV68u'
    // Create a variable to hold the value of rating
    // var rating = document.querySelector('#rating').value;
    //  https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=nNVtVCtPxYIdqgXcnAhfGjtCq9cW1SUGJ6AnV68u
    fetch(sNpsApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            aNPS[0].markerName = response.data[0].fullName;
            aNPS[0].latitude = response.data[0].latitude;
            aNPS[0].longitude = response.data[0].longitude;
            
            for (i = 1; i < response.data.length; i ++) {
                aNPS.push(
                    {
                        markerName: response.data[i].fullName,
                        latitude: response.data[i].latitude,
                        longitude: response.data[i].longitude,
                    }
                )
            }
            updateMap();
            // var responseContainerEl = document.querySelector('#response-container');
            // responseContainerEl.innerHTML = '';
            // var gifImg = document.createElement('img');
            // gifImg.setAttribute('src', response.data[0].images.fixed_height.url);
            // responseContainerEl.appendChild(gifImg);
        });

}

