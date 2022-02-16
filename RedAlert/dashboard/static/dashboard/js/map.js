 // initialize Leaflet
 var map = L.map('map').setView({lon: 0, lat: 0}, 2);

 // add the OpenStreetMap tiles
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
 }).addTo(map);

 // show the scale bar on the lower left corner
 L.control.scale({imperial: true, metric: true}).addTo(map);

 // show a marker on the map
 L.marker({lon: 0, lat: 0}).bindPopup('The center of the world').addTo(map);
 
 var popup = L.popup()
 .setLatLng([0,1])
 .setContent("Welcome to the tech demo.")
 .openOn(map);


 function onMapClick(e) {
 // alert("You clicked the map at " + e.latlng);
 // var newCircle = L.circle(e.latlng,20000);
 // newCircle.addTo(map);

 console.log(e.latlng);

 // create a red polygon from an array of LatLng points
 var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
 var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
 // zoom the map to the polygon
 //map.fitBounds(polygon.getBounds());

 L.marker({lon: -104.9633, lat: 39.7114}).bindPopup('John Doe').addTo(map);
 L.marker({lat: 38.819649, lon: -104.786053}).bindPopup('Ann Marie').addTo(map);
 console.log(polygon.getBounds());

 }
 
 map.on('click', onMapClick);
 
 
 // Note: geocoding all of the adressess in a certain area and comparing those adresses to our client database would be incredibly
 // expensive and resource heavy.
 // create a red polygon from an array of LatLng points

 