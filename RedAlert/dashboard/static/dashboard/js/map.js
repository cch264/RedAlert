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
  iconUrl: '/static/dashboard/images/selectedClientPin.png',  
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [0, -45] // pop up anchor is relative to icon anchor so that why were using a negative value and 0
});
 
 // Note: geocoding all of the adressess in a certain area and comparing those adresses to our client database would be incredibly
 // expensive and resource heavy.
 // create a red polygon from an array of LatLng points

 // Creates a layer group. Basically a container of all of our plotted addresses.
var clientLayerGroup = L.layerGroup();

var clientMarkerArray = [];

 function plotClientSearchresults( resultsObj )
 {

  clientLayerGroup.clearLayers();
  clientMarkerArray = [];

  resultsObj.forEach( (result) => {

    
    let long = result.item.long;
    let lat = result.item.lat;
    
    // Marker takes lat and then long
    let clientAddress = L.marker([lat, long] );
    clientAddress.addTo( clientLayerGroup );
    
    clientAddress.bindPopup(`
    <div data-client-id="${result.item.id}" class="d-flex flex-column justify-content-start">
    <div> Name - ${result.item.name} </div>
    <div> Address- <span> ${result.item.unit_num} ${result.item.street} <br> ${result.item.city}, ${result.item.state}, ${result.item.zip_code} </span> </div>
    </div>`);
    
    clientAddress.on('click', ( event ) => {
      console.log(`You clicked a client with name ${ result.item.name }!`)
    

      //toggleClientSelection( result );
      
      togglePinSelect( result, clientAddress );
      
    
      

    
      
    })

    clientMarkerArray.push( {markerObj: clientAddress, selected: false, clientID: result.item.id.toString() } );

  })

  
  clientLayerGroup.addTo( map );

  //console.log(`Client marker array is ${JSON.stringify( clientMarkerArray )}`);
 }

 function togglePinSelect( clientResultObj, clientMarker )
 {

   let markerObj = getMarkerFromArray( clientResultObj.item.id.toString() );

   console.log(`Marker info. Marker OBJ: ${markerObj.markerObj} Selected: ${markerObj.selected} Client ID: ${markerObj.clientID}`)

    if(markerObj.selected)
    {
      markerObj.selected = false;
      toggleClientSelection( clientResultObj );
    }
    else
    {
      markerObj.selected = true;
      toggleClientSelection( clientResultObj );
    }


    if(clientMarker.getIcon() === L.Marker.prototype.options.icon)
    {
      clientMarker.setIcon( selectedPinIcon  );
    }
    else
    {
      clientMarker.setIcon( L.Marker.prototype.options.icon  );
    }
    

   // If the marker is selected...
   /*
   if( getMarkerInfoObj.selected )
   {

   }
   else
   {

   }
   */
 }

 function getMarkerFromArray( clientIDString )
 {
   let markerObjToReturn;
  clientMarkerArray.forEach((result) => {

    //console.log(`Marker array item ${result.markerObj } MarkerObj ID: ${result.clientID} Client id String: ${clientIDString} Comparison is: ${result.clientID === clientIDString }`)

    if( result.clientID === clientIDString )
    {
      //console.log(`resturning markerObj`)
      markerObjToReturn = result;
    }
  });

  return markerObjToReturn;
 }


window.addEventListener('load', (event) => {
  console.log("Found map js file!");
}); 