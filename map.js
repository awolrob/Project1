function initMap() {
    const myLatLng = { lat: 41.39855173798833, lng: -82.21036065433786 };
    const myLatLng2 = { lat: 41.385959371762645, lng: -82.21088860697019 }; 
    /* test local long and lat 41.38923980160808, -82.21027917718673  41.38855173798833, -82.21036065433786
    41.385959371762645, -82.21088860697019 */
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: myLatLng,
    });
    new google.maps.Marker({
        position: myLatLng,
        map,
        title: "DQ In Amherst",
    });
    new google.maps.Marker({
        position: myLatLng2,
        map,
        title: "Subway",
    });
}