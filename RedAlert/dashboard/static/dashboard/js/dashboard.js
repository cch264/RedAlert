


var search_all_keys = [
  "id",
  "name",
  "unit_num",
  "street",
  "city",
  "zip_code",
  "state",
  "license_num",
  "policies",
  "age",
  "birthdate",
  "gender",
  "notificatoin_status",
  "email"
]

var search_keys = search_all_keys;

// Array that holds the users selected filters.
var searchKeysAndPatterns = [false];

var searchKeysAndRangePatterns = [false];


function executeFuseSearch( user_pattern)
{
    const options = {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        // threshold: 0.6,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
        // fieldNormWeight: 1,

        // Specifies keys in your json to search by.
        keys: search_keys
      };
    
      //console.log(`JSON STRING ${ $('#client-json-input').val() }`);

      //console.log(`JSON  ${ JSON.parse( $('#client-json-input').val()) }`);

      // Only use user input if we are supposed to. If user is using filters we may not want to use their input.
     
      search_data_json = JSON.parse( $('#client-json-input').val());
      
     

      const fuse = new Fuse( search_data_json, options);
      
      // Change the pattern
      const pattern = ""

      //console.log( fuse.search( user_pattern ) )
      
      return fuse.search( user_pattern )
     
}


// This method called when the dashboard page loads. Put event listeners in here.
window.addEventListener('load', (event) => {
    console.log('page is fully loaded');

    // Overwrite the forms on submit method so we can add our custom ajax function to execute on form submit.
    $('#user-search-box-form').on('submit', function(event)
        {
            // PREVENT the default behavior of the form. Without this line, ajax wont work right or FUSE.js.
            event.preventDefault();

            executeSearch();

        })

        createSearchKeyCategoryArray();

        assignSearchFilterListeners();

        createSearchKeyRangeArray();

        // Filters that take a range are assigned listeners here.
        assignSearchFilterRangeListeners();


  });

  function assignSearchFilterListeners()
  {

    $("[id$='-filter-pattern']").each( function()
    {
      console.log(`Data is ${$(this).data('queryPattern') }`);

      //console.log(`Data is a range: ${ $(this).data('isRange') }`);

      $(this).on('click',function()
      {

        // Check if user selected or deselected the filter
        if( $(this).is(":checked") )
        {
          console.log('Input checked, input is checked');

           // if they selected it, add the search key to the array if it does not exist already, and add the search key within that array.
          // If the filter key array has first element set to false, set it to true, else do nothing.
          updateFilterArray( addFilter=true, $(this).data('queryKey'), $(this).data('queryPattern'));

        }
        else
        {
          console.log('Input unchecked, input is unchecked');

          // If user deselected the filter, remove the filter pattern from the array. Check if any other filters are selected based on selected inputs on the page, do not use array to confirm this.
          updateFilterArray( addFilter=false, $(this).data('queryKey'), $(this).data('queryPattern'));

        }
      });
    });

  }

  function assignSearchFilterRangeListeners()
  {
     // When user lifts up key check inputs.
     $( '#age-filter-range-pattern-1,#age-filter-range-pattern-2' ).keyup( function( event )
     {
       console.log(`range value ${event.target.value}`);
 
       // Check the two range elements to see if they match up
       let rangeIsGood = checkRange( $( '#age-filter-range-pattern-1' ), $( '#age-filter-range-pattern-2' ));
 
       if( rangeIsGood === 1 )
       {
         searchKeysAndRangePatterns[0] = true;

         let rangeToPush = $('#age-filter-range-pattern-1').val() + '-' + $('#age-filter-range-pattern-2').val();

         searchKeysAndRangePatterns[1] = ['age', rangeToPush ];

         console.log(`New range key array is ${searchKeysAndRangePatterns}`);
 
       }
       // If user clears array or enters bad input, clear the array
       else if( rangeIsGood === 3 || rangeIsGood === 0)
       {
         searchKeysAndRangePatterns[0] = false;
         searchKeysAndRangePatterns[1] = ['age'];
         console.log(`New range key array is ${searchKeysAndRangePatterns}`);
       }
     })

  }


  // Iterate through each pair of range elements, if any of the ranges are incomplete, add text describing issue.
  // Returns 0 for bad inputs, returns 1 for good inputs, and returns 3 for cleared inputs.
  function checkRange( rangeElem1, rangeElem2 )
  {

    // Reg exp that checks to see if the string contains all numbers
    var reg = new RegExp('^[0-9]+$');

    let range1IsAllNums = reg.test( $(rangeElem1).val() );
    let range2IsAllNums = reg.test( $(rangeElem2).val() );
    console.log(`Range 1 valid nums: ${range1IsAllNums}`);
    console.log(`Range 2 valid nums: ${range2IsAllNums}`);

    if( !range1IsAllNums )
    {
      
      $(rangeElem1).attr('class', 'invalid-age-range');
      console.log("Range 1 invalid cus letter")
    }
    if( !range2IsAllNums)
    {
      $(rangeElem2).attr('class', 'invalid-age-range');
      console.log("Range 2 invalid cus letter");
    }

    if( $(rangeElem1).val() === '' && $(rangeElem2).val() === '' )
    {
      $(rangeElem1).attr('class', 'valid-age-range');
      $(rangeElem2).attr('class', 'valid-age-range');
      return 3;
    }


    if( range1IsAllNums && range2IsAllNums)
    {
      validLowerUpper = parseInt( $(rangeElem1).val() ) <= parseInt( $(rangeElem2).val() );

      if( !validLowerUpper )
      {
        $(rangeElem1).attr('class', 'invalid-age-range');
        $(rangeElem2).attr('class', 'invalid-age-range');
        console.log("Ranges invalid lower and upper")
      }
      else if( validLowerUpper )
      {
        $(rangeElem1).attr('class', 'valid-age-range');
        $(rangeElem2).attr('class', 'valid-age-range');

        return 1;
      }
    }

    return 0;


  }

  function updateFilterArray( addFilter, queryKey, queryPattern )
  {

    if( addFilter )
    {
      // first make sure that the filter array first element is set to true, as this indicates filters are being used.
      searchKeysAndPatterns[0] = true;

      // Start 1 because index 0 just holds a boolean
      for( let filterIndex = 1; filterIndex < searchKeysAndPatterns.length; filterIndex++ )
      {
        // each inner array represents a search key and pattersn to match. ie city could be search key and pattersn to match would be 'mesa' or 'phoenix'
        searchKeyInnerArray = searchKeysAndPatterns[filterIndex];

        console.log(`Search key inner array: ${searchKeyInnerArray}`);

        if( searchKeyInnerArray[0] === queryKey )
        {
          searchKeyInnerArray.push(queryPattern);

          console.log(`Filter array after adding new filter: ${searchKeysAndPatterns}`);

          // We added the filter, break out of the function.
          return;
        }
      }
    }

    else
    {
      
      // Start 1 because index 0 just holds a boolean
      // Remove applied filters.
      for( let filterIndex = 1; filterIndex < searchKeysAndPatterns.length; filterIndex++ )
      {
        // each inner array represents a search key and pattersn to match. ie city could be search key and pattersn to match would be 'mesa' or 'phoenix'
        searchKeyInnerArray = searchKeysAndPatterns[filterIndex];

        console.log(`Inner array when removing filter: ${searchKeyInnerArray}`);

        if( searchKeyInnerArray[0] === queryKey )
        {
          // Use filter to remove any elements that are equal to the query pattern. 
          searchKeysAndPatterns[filterIndex] = searchKeyInnerArray.filter( currentFilter => {
                return currentFilter != queryPattern;
              }
            );

          console.log(`Inner array after remove filter ${searchKeysAndPatterns[filterIndex] }`);

          // Break out of the loop. A while loop would have been more appropraite here.
          filterIndex = searchKeysAndPatterns.length;
        }
      }


      console.log(`Filter array before checking for no filters: ${searchKeysAndPatterns}`);
      // After removing the element from the search pattern array, we need to check if the array is empty and if we should not apply any filters
      // If there are not selected filters set the first element of searchKeysAndPatterns to false else break the loop and do nothing.
      // Start 1 because index 0 just holds a boolean
      for( let filterIndex = 1; filterIndex < searchKeysAndPatterns.length; filterIndex++ )
      {
        // each inner array represents a search key and pattersn to match. ie city could be search key and pattersn to match would be 'mesa' or 'phoenix'
        searchKeyInnerArray = searchKeysAndPatterns[filterIndex];

        console.log(`Search key inner array: ${searchKeyInnerArray}`);

        // If one of the search key inner arrays has length greater than 1, that means there are still selected filters on the page.
        // Break loop were done.
        if( searchKeyInnerArray.length > 1)
        {
          console.log(`Filter array has filters still, leave first elem true: ${searchKeysAndPatterns}`);
          return;
        }
      }

      // If we dont return that means there are not applied filters. Set the first elem of the searchKeysAndPatterns Array to false.
      searchKeysAndPatterns[0] = false;

      console.log(`No filter selected. Setting first elem to false: ${searchKeysAndPatterns}`);
    }

  }

  // Initialize the array that will hold search key categories and selected filters.
  function createSearchKeyCategoryArray()
  {
    $('.filter-pattern-category').each(function()
    {
      searchKeysAndPatterns.push( [ $(this).text().toLowerCase() ] );
    })

    console.log(`Search key array is ${searchKeysAndPatterns}`);
  }


  // Initialize the array that will hold search key categories that take ranges as inputs.
  function createSearchKeyRangeArray()
  {
    $('.filter-range-pattern-category').each(function()
    {
      searchKeysAndRangePatterns.push( [ $(this).text().toLowerCase() ] );
    })

    console.log(`Search key range array is ${searchKeysAndRangePatterns}`);
  }

  


function executeSearch(  ) 
{
  console.log("Search keys is " + search_keys); 


  search_result_object = executeFuseSearch(  $('#user-search-input').val());

  fill_client_results_box( search_result_object );

}

function fill_client_results_box( client_list )
{
  // Remove previous search results
  $('#search-results-container').empty();

  // Iterate through each result from the users search and create each client element to be dispalyed to the user. Also assign click listeners to each search result so we can keep track of which clients
  // have been selected.
  client_list.forEach( ( result ) => {


  // Create html element for each search result returned from search.
  let element_to_append = generateSearchElement(result);

    $('#search-results-container').append( element_to_append );

    // Get the div that contains the search result.
    $(`#sr-btn-${result.item.id}`).on('click', (event) => {

      $(`#sr-${result.item.id}`).addClass('sel-sr-color');

      invertPlusBtn( `#sr-btn-${result.item.id}` );

      
      // If the client search result already exist in the selected clients container, remove it.
      // If you query an html element and jquery returns 0 that means the element was not found and we know it does not exist.
      if( $(`#selected-sr-${result.item.id}`).length )
      {
        $(`#selected-sr-${result.item.id}`).remove();
        $(`#sr-${result.item.id}`).removeClass('sel-sr-color');

        refreshSelectedClientsString();
      }
      else
      {
        // Create html element for each search result the user clicks.
        let selected_search_result = generateSelectedSearchElement(result);

        // Add the new element that was created by cloning the unselected search result item. Remove the sel-sr-color class from the cloned item.
        $("#selected-clients-container").append( selected_search_result );


        $(`#sel-sr-btn-${result.item.id}`).on('click', function(event){ $(`#selected-sr-${result.item.id}`).remove(); invertPlusBtn( `#sr-btn-${result.item.id}`); $(`#sr-${result.item.id}`).removeClass('sel-sr-color'); refreshSelectedClientsString(); });
       
        refreshSelectedClientsString();
      }

    })

    console.log(`The result: ${JSON.stringify(result.item) }`);
    //console.log(`id ${ result.item.id }`);
    //console.log(`name ${ result.item.name }`);
    //console.log(`email ${ result.item.email }`);
    //console.log(`age ${ result.item.age }`);

});
}

// Create html element for each search result returned from search.
function generateSelectedSearchElement(result)
{

  return `<div id="selected-sr-${result.item.id}" data-client-id="${result.item.id}" class="bootstrap-grey-bottom my-1 me-1 ms-5 d-flex flex-row client-sr">
            <div class="d-flex flex-column justify-content-center ps-2">
              <div id="sel-sr-btn-${result.item.id}" class="remove-sr-btn"> Remove <i class="px-2 fa-solid fa-xmark"></i></div> 
            </div>
              
            <div class="container">

              <div class="row mb-1">
                <div class="col"> Name: ${result.item.name} </div>
                <div class="col"> Address: ${result.item.unit_num} ${result.item.street} ${result.item.city}, ${result.item.state}, ${result.item.zip_code}</div> 
                <div class="col"> Policies: ${result.item.polcies}</div>
              </div>

              <div class="row mb-1">
                <div class="col"> Age: ${result.item.age}</div>
                <div class="col"> Birthdate: ${result.item.birthdate}</div>
                <div class="col"> Gender: ${result.item.gender}</div>
              </div>

              <div class="row">
                <div class="col"> Notification Status: ${result.item.notification_status}</div>
                <div class="col"> License Number: ${result.item.license_num}</div>
                <div class="col"> Phone Number: ${result.item.phone}</div>
              </div>

            </div>
          </div>
          `;

}

// Create html element for each search result returned from search.
function generateSearchElement(result)
{
  return `<div id="sr-${result.item.id}" data-client-id="${result.item.id}" class="bootstrap-grey-bottom my-1 me-1 ms-5 d-flex flex-row client-sr">
              <div class="d-flex flex-column justify-content-center ps-2">
                <div id="sr-btn-${result.item.id}" class="select-client-btn plus-btn"> Select <i class="fa-solid fa-plus"></i> </div>
              </div>
                
              <div class="container">

                <div class="row mb-1">
                  <div class="col"> Name: ${result.item.name} </div>
                  <div class="col"> Address: ${result.item.unit_num} ${result.item.street} ${result.item.city}, ${result.item.state}, ${result.item.zip_code}</div> 
                  <div class="col"> Policies: ${result.item.polcies}</div>
                </div>

                <div class="row mb-1">
                  <div class="col"> Age: ${result.item.age}</div>
                  <div class="col"> Birthdate: ${result.item.birthdate}</div>
                  <div class="col"> Gender: ${result.item.gender}</div>
                </div>

                <div class="row">
                  <div class="col"> Notification Status: ${result.item.notification_status}</div>
                  <div class="col"> License Number: ${result.item.license_num}</div>
                  <div class="col"> Phone Number: ${result.item.phone}</div>
                </div>

              </div>
          </div>
          `;
}

function invertPlusBtn( elementID)
{

  if($( elementID ).hasClass('plus-btn')  )
      {
        // Remove plus icon from search result
        $(elementID).empty();
        $(elementID).removeClass('select-client-btn');
        $(elementID).removeClass('plus-btn');
        $(elementID).addClass('remove-sr-btn');
        $(elementID).append(` Remove <i class="px-2 fa-solid fa-xmark"></i>`);
      }
      else
      {
        // Remove x icon from search result and replace with plus. Replace classes so the plus button is styled properly.
        $(elementID).empty();
        $(elementID).removeClass('remove-sr-btn');
        $(elementID).addClass('plus-btn');
        $(elementID).addClass('select-client-btn');
        $(elementID).append(` Select <i class="fa-solid fa-plus"></i> `);
      }
}

function refreshSelectedClientsString()
{
  let clientIdString = "";
  // Remove all ids from the container
  $("#selected-clients-id-array").val("");

  $("#selected-clients-container").children().each( function(index) {
    // Ignore index 0 as it is the input we are storing client ids in so it is not needed
    if( index > 0)
    {
      console.log(`ID OF CHILD ${ $(this).attr('id')}`);

      clientIdString += $( this ).data("clientId") + " ";
    }
  })


  $("#selected-clients-id-array").val(clientIdString);
}


function executeSearchAjax() {
    $.ajax({

        
        url:'/dashboard/execute_search/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        // Pass data to the django function
        data: {user_query: $('#user-search-input').val() },

        // Function to call when to django returns a response to our ajax request.
        success: function (data) {
            //var x = JSON.stringify(data);
            console.log("AJAX RESPONDEED WITH SUCCESS THE QUERY WAS: " + data['msg']);
        },
        // Error handling LOWKEY USELESS
        error: function ( jqXHR, textStatus, errorThrown ) {
            console.log(`Error WITH AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

            console.log('Error - ' + errorMessage);
        }
    });
}