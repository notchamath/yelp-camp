mapboxgl.accessToken = mapToken;
    
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: camp.geometry.coordinates,
    zoom: 8 // starting zoom
    });

    new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(`<h5>${camp.title}</h5>`)
    )
    .addTo(map)