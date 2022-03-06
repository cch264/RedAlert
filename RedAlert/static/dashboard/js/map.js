 // initialize a map object in an element with the given id, ie client-map.
 var map = L.map('client-map').setView(new L.LatLng(34, -111), 7);

 // add the OpenStreetMap tiles
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
 }).addTo(map);

 // show the scale bar on the lower left corner
 L.control.scale({imperial: true, metric: true}).addTo(map);


 function onMapClick(e) {

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
 
 var selectedPinIcon = L.icon({
  iconUrl: '/static/dashboard/images/selectedClientPin.jpg',  
  iconSize: [76, 61],
  iconAnchor: [38, 61],
  popupAnchor: [ 38, 10],
});
 
 // Note: geocoding all of the adressess in a certain area and comparing those adresses to our client database would be incredibly
 // expensive and resource heavy.
 // create a red polygon from an array of LatLng points

 // Creates a layer group. Basically a container of all of our plotted addresses.
var clientLayerGroup = L.layerGroup();

 function plotClientSearchresults( resultsObj )
 {

  clientLayerGroup.clearLayers();

  resultsObj.forEach( (result) => {
    let long = result.item.long;
    let lat = result.item.lat;

    // Marker takes lat and then long
    let clientAddress = L.marker([lat, long], {icon: selectedPinIcon}).addTo( clientLayerGroup );
    clientAddress.bindPopup(`
    <div data-client-id="${result.item.id}" class="d-flex flex-column justify-content-start">
      <div> Name - ${result.item.name} </div>
      <div> Address- <span> ${result.item.unit_num} ${result.item.street} <br> ${result.item.city}, ${result.item.state}, ${result.item.zip_code} </span> </div>
    </div>`);

    clientAddress.on('click', ( event ) => {
      console.log(`You clicked a client with name ${ result.item.name }!`)

      toggleClientSelection( result );

    })
  })

  
  clientLayerGroup.addTo( map );
 }


window.addEventListener('load', (event) => {
  console.log("Found map js file!");
}); 