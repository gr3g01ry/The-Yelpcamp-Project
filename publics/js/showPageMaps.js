mapboxgl.accessToken = mapToken;
console.log(campground);
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
    // projection: 'globe',
	zoom: 15, // starting zoom
});

new mapboxgl.Marker({color:'orange'})
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:15})
        .setHTML(
            `<h6 style="color:orange">${campground.title}</h6><p class="bg-secondary mb-0">${campground.location}</p>`
        )
    )
    .addTo(map)







