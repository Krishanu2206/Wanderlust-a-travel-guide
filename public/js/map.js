

        // TO MAKE THE MAP APPEAR YOU MUST
        // ADD YOUR ACCESS TOKEN FROM
        // https://account.mapbox.com
mapboxgl.accessToken = maptoken;

const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', //style URL
center: coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

console.log(coordinates);

// Create a new marker.
const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordinates) //listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset:25})
    .setHTML("<h3>Your perfect Destination!!</h3>"))
    .addTo(map);