function initMap() {
    myLatLng.lat = parseFloat(aNPS[0].latitude);
    myLatLng.lng = parseFloat(aNPS[0].longitude);
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: myLatLng,
    });
}

function updateMap() {
    const image =
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    myLatLng.lat = parseFloat(aNPS[0].latitude);
    myLatLng.lng = parseFloat(aNPS[0].longitude);
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5,
        center: myLatLng,
    });
    new google.maps.Marker({
        position: myLatLng,
        map,
        title: aNPS[0].markerName,
    });

    for (i = 1; i < aNPS.length; i++) {
        myLatLng.lat = parseFloat(aNPS[i].latitude);
        myLatLng.lng = parseFloat(aNPS[i].longitude);
        markerName = aNPS[i].markerName;
        // window.setTimeout(() => {
        new google.maps.Marker({
            position: myLatLng,
            map,
            title: markerName,
            icon: image,
            animation: google.maps.Animation.DROP,
        })
            ;
        // }, 50);
    }

}