 // initialize a map object in an element with the given id, ie client-map.
 var map = L.map('client-map').setView(new L.LatLng(34, -111), 7);

 // add the OpenStreetMap tiles
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
 }).addTo(map);

 // show the scale bar on the lower left corner
 L.control.scale({imperial: true, metric: true}).addTo(map);

 var selectedPinIcon = L.icon({
  iconUrl: '/static/dashboard/images/selectedClientPin.png',  
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [0, -45] // pop up anchor is relative to icon anchor so that why were using a negative value and 0
});

var startDrawingIcon = L.icon({
  iconUrl: '/static/dashboard/images/blackOutlineFlag.png',  
  iconSize: [51, 51],
  iconAnchor: [5, 51],
});

var startingLine = true;
var latlngs = [];
var drawStartPoint;
// a polyline object that is the user drawn shape on the map.
var userShape;

function onMapClick( event ) {

  console.log(`Event lat ${event.latlng.lat} Event long ${event.latlng.lng}`);

  if( startingLine )
  {
    latlngs.push([event.latlng.lat, event.latlng.lng]);

    userShape = L.polyline(latlngs, {color: 'red'}).addTo(map);

    drawStartPoint = L.marker([event.latlng.lat, event.latlng.lng], {icon: startDrawingIcon} ).addTo(map);

    startingLine = false;
  }
  else
  {
    latlngs.push([event.latlng.lat, event.latlng.lng]);

    userShape = L.polyline(latlngs, {color: 'red'}).addTo(map);
  }


}
 
 map.on('click', onMapClick);
 

 
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
      
      togglePinSelect( result );
      
    
      

    
      
    })

    clientMarkerArray.push( {markerObj: clientAddress, selected: false, clientID: result.item.id.toString() } );

  })

  
  clientLayerGroup.addTo( map );

  //console.log(`Client marker array is ${JSON.stringify( clientMarkerArray )}`);
 }

 // Toggles a pins icon and also toggles search results elements when a pin is clicked.
 function togglePinSelect( clientResultObj )
 {

   let markerObj = getMarkerFromArray( clientResultObj.item.id.toString() );

   console.log(`Marker info. Marker OBJ: ${markerObj.markerObj} Selected: ${markerObj.selected} Client ID: ${markerObj.clientID}`)

    if(markerObj.selected)
    {
      markerObj.selected = false;
      toggleClientSelection( clientResultObj ); // located in dashboard.js, pin icon toggled in here. We make a call to toggleSpecificPin in this func
    }
    else
    {
      markerObj.selected = true;
      toggleClientSelection( clientResultObj );
    }
  
 }

 function toggleSpecificPin( clientIDString )
 {
   console.log(`Toggle specific pin.`);
  let markerObj = getMarkerFromArray( clientIDString );

  if(markerObj.selected)
  {
    markerObj.selected = false;
  }
  else
  {
    markerObj.selected = true;
  }


  if(markerObj.markerObj.getIcon() === L.Marker.prototype.options.icon)
  {
    markerObj.markerObj.setIcon( selectedPinIcon  );
  }
  else
  {
    markerObj.markerObj.setIcon( L.Marker.prototype.options.icon  );
  }

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

























