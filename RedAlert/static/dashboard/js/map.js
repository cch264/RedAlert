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
  iconUrl: '/static/dashboard/images/redFlag.png',  
  iconSize: [51, 51],
  iconAnchor: [5, 51],
});

var startingLine = true;
var latlngs = [];
var drawStartPoint;
// a polyline object that is the user drawn shape on the map.
var userShape;

function onMapClick( event ) {

  drawPolygonOnMap( event );

}
 
 map.on('click', onMapClick);
 

 // Creates a layer group. Basically a container of all of our plotted addresses.
var clientLayerGroup = L.layerGroup();

// Array that holds all client marker objects that are visible on the map
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
      
      togglePinSelect( result.item.id );
      
    
      

    
      
    })

    // Current clients on the map.
    clientMarkerArray.push( {markerObj: clientAddress, selected: false, clientID: result.item.id.toString() } );

  })

  
  clientLayerGroup.addTo( map );

  //console.log(`Client marker array is ${JSON.stringify( clientMarkerArray )}`);
 }

 // Toggles a pins icon and also toggles search results elements when a pin is clicked.
 function togglePinSelect( clientIDInt )
 {

   let markerObj = getMarkerFromArray( clientIDInt.toString() );

   console.log(`Marker info. Marker OBJ: ${markerObj.markerObj} Selected: ${markerObj.selected} Client ID: ${markerObj.clientID}`)

    if(markerObj.selected)
    {
      markerObj.selected = false;
      toggleClientSelection( clientIDInt ); // located in dashboard.js, pin icon toggled in here. We make a call to toggleSpecificPin in this func
    }
    else
    {
      markerObj.selected = true;
      toggleClientSelection( clientIDInt );
    }
  
 }

 // Toggles a pin from selected to desected or vice versa.
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

 function selectSpecificPin( clientIDString )
 {
  let markerObj = getMarkerFromArray( clientIDString );

   console.log(`Marker info. Marker OBJ: ${markerObj.markerObj} Selected: ${markerObj.selected} Client ID: ${markerObj.clientID}`)

    if( !markerObj.selected )
    {
      markerObj.selected = true;
      toggleClientSelection( parseInt(clientIDString) );// located in dashboard.js, pin icon toggled in here. We make a call to toggleSpecificPin in this func
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


 /*
 var drawMode = false;
 var startingLine = true;
  var latlngs = [];

  // Current Marker
  var drawStartPoint;
  // a polyline object that is the user drawn shape on the map.
  // Current shape.
  var userShape;
 */
 function drawPolygonOnMap( clickEvent )
 {
    console.log(`Event lat ${clickEvent.latlng.lat} Event long ${clickEvent.latlng.lng}`);

    if( true )
    {
      if( startingLine )
      {
        latlngs.push([clickEvent.latlng.lat, clickEvent.latlng.lng]);
  
        userShape = L.polyline(latlngs, {color: 'red'}).addTo(map);
  
        drawStartPoint = L.marker([clickEvent.latlng.lat, clickEvent.latlng.lng], {icon: startDrawingIcon} ).addTo(map);
        
        drawStartPoint.on('click', (drawStartPoint) => completeShape(drawStartPoint, userShape ) );
  
        startingLine = false;
      }
      else
      {
        latlngs.push([clickEvent.latlng.lat, clickEvent.latlng.lng]);
  
        userShape = L.polyline(latlngs, {color: 'red'}).addTo(map);
      }

    }
 }

 // Change color of marker icon, to green for complete shape.
 // remove click listener from polyStartMarker 
 function completeShape( polyStartMarker, polyLine )
 {
  calculatePointsInPoly();

  latlngs = [];// reset coordinate array.

  drawMode = false;

  startingLine = true;

  polyStartMarker.setStyle( {color: 'green'} );

 }

 function calculatePointsInPoly()
 {

  // Push first point onto end of array to compelte the polygon for drawing purposes.
  latlngs.push(latlngs[0])

  console.log(`LATLGNS AFTER PUSH ${latlngs}`);
  
  // this gets called when the user completes their shape, so complete the last line of their shape for them.
  // Push the first point onto the array so we have a complete polygon.
  L.polyline(latlngs, {color: 'red'}).addTo(map);

  latlngs.pop()

  //robustPointInPolygon

  let clientIDsInShape = [];

  for( let index = 0; index < clientMarkerArray.length; index++ )
  {
    let clientMarkerInfo = clientMarkerArray[index];
    let clientMarkerObj = clientMarkerInfo.markerObj;
    let clientLatLong = clientMarkerObj.getLatLng();

    let clientIsInShape = robustPointInPolygon(latlngs, [ clientLatLong.lat, clientLatLong.lng] );
    console.log(`Client ID: ${ clientMarkerInfo.clientID} In user poly ${clientIsInShape } `)
    

    // Robust point in polygon returns a -1 if the point is in the polygon, 0 if the point is on the polygon boundry, and 1 if the point is outside the shape.
    if( clientIsInShape < 0)
    {
      clientIDsInShape.push( clientMarkerInfo.clientID );
    }
    
  }

  selectAllPinsInShape(clientIDsInShape);

 }

 // Checks an array of client ids that are inside a user drawn shape. Selects the client pins if they are in the shape.
 function selectAllPinsInShape( clientIDStrArray )
 {
   for( let index = 0; index < clientIDStrArray.length; index++ )
    {
      selectSpecificPin( clientIDStrArray[index] );
    }
 }

window.addEventListener('load', (event) => {
  console.log("Found map js file!");
}); 

























