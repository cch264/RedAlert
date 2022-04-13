// GLOBALS
var selected_client_id_array = [];

var all_clients = JSON.parse( $('#client-json-input').val() );



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

var search_result_object;

var search_keys = search_all_keys;

// Array that holds the users selected filters.
var searchKeysAndPatterns = [false];

var searchKeysAndRangePatterns = [false];


function executeFuseSearch( user_pattern, showAllResults=false )
{
    const options = {
        // isCaseSensitive: false,
        // includeScore: false,
        shouldSort: true,
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

      // Get the json from the input element and parse it to convert it to a json.
      // This json has an entry for EVERY single client in the DB.
      search_data_json = JSON.parse( $('#client-json-input').val());

      // pass the client json to the search function.
      const fuse = new Fuse( search_data_json, options);

      // Change the pattern
      const pattern = ""

      // We show all results on page load, and when the user selects new filters.
      if( showAllResults)
      {
        //console.log("Showing all search results");
        unfiltered_search_results = fuse.search(" ");

        filtered_search = filterSearchResults(unfiltered_search_results);

        // Filter the entire array and do not use a query to search.
        return filtered_search;
      }
      else // else search like normal.
      {
        // Filter the results using the json array as the first paramter.
        unfiltered_search_results = fuse.search( user_pattern );

        filtered_search = filterSearchResults(unfiltered_search_results);

        return filtered_search;
      }


}

function filterSearchResults( searchResultJSON )
{
  //[true, ['city','mesa','chandler'], ['policy','home','fire']]

  // If there are filters selected and present in the array filter with them.
  if( searchKeysAndPatterns[0] )
  {
    // Iterate through each pattern in the array
    for(let index = 1; index < searchKeysAndPatterns.length; index++)
    {
      let innerArray = searchKeysAndPatterns[index];

      // Only iterate through inner array if length > 1 because that means filters are present.
      if( innerArray.length > 1)
      {
        // Get key name from array.
        let keyName = innerArray[0];

        //console.log(`Filtering: Key name is: ${keyName}`)

        // Filter our results json.
        searchResultJSON = searchResultJSON.filter( result =>
          {
            let matchesFilter = [];

            for(let innerIndex = 1; innerIndex < innerArray.length; innerIndex++)
            {
              let pattern = innerArray[ innerIndex ];

              //console.log(`Matching pattern: ${pattern} against result city name ${result.item[keyName]}`)

              // Create array of booleans, if the result contains the pattern, push true to the array.
              // If the filters are city: mesa, chandler then we need to check each search result for mesa OR chandler so we create an array that checks.
              matchesFilter.push( result.item[keyName].toLowerCase().includes(pattern).toString() );
            }

            //console.log(`matches filter arrary ${matchesFilter}`);

            return matchesFilter.includes('true');
          })
      }

    }

  }

  if( searchKeysAndRangePatterns[0] )
  {
    // Iterate through each pattern in the array
    for(let index = 1; index < searchKeysAndRangePatterns.length; index++)
    {
      let innerArray = searchKeysAndRangePatterns[index];

      // Only iterate through inner array if length > 1 because that means filters are present.
      if( innerArray.length > 1)
      {
        // Get key name from array.
        let keyName = innerArray[0];

        console.log(`Filtering: Key name is: ${keyName}`)

        // Filter our results json.
        // The searchKeysAndRangePatterns Array currently will only even contain one range, the age range so we dont need a loop here.
        searchResultJSON = searchResultJSON.filter( result =>
          {

            let lowerUpperArray= innerArray[1].split('-');

            let lowerBound = parseInt(lowerUpperArray[0]);
            let upperBound = parseInt(lowerUpperArray[1]);

            console.log(`Lower bound: ${lowerBound} Upper bound ${upperBound}`);


            let searchResultAge = parseInt(result.item.age);

            return ( lowerBound <= searchResultAge ) && ( searchResultAge <= upperBound );
          })
      }

    }
  }



  return searchResultJSON;
}


// This method called when the dashboard page loads. Put event listeners in here.
window.addEventListener('load', (event) => {
    console.log('page is fully loaded');

    clearFilterInputs();

    // When the page loads show all search results.
    executeSearch(true);


    $("#expand-sr-btn").on('click', addListenerToSearchResultScrollBox );

    $('#no-selections-showing').on('click', ()=>{ $('#no-selections-showing').addClass('display-none'); $('#user-search-input').val(""); executeSearch(); })




    // Overwrite the forms on submit method so we can add our custom ajax function to execute on form submit.
    $('#user-search-box-form').keyup(function(event)
        {
          if( !$('#no-selections-showing').hasClass('display-none') )
          {
            $('#no-selections-showing').addClass('display-none');
          }
            // PREVENT the default behavior of the form. Without this line, ajax wont work right or FUSE.js.
            event.preventDefault();

            executeSearch();


        })

        createSearchKeyCategoryArray();

        assignSearchFilterListeners();

        createSearchKeyRangeArray();

        // Filters that take a range are assigned listeners here.
        assignSearchFilterRangeListeners();

        $('#clear-filters-btn').on('click', clearFilterInputs );

  });

// Event listener for obtaining message data when a user clicks "Send Message"
var btn = document.querySelector('#send-msg');

btn.addEventListener('click', (event) => {
  send_client_notification();
})

function send_client_notification()
{
  let message_subject = $('#message-subject');
  message_subject = message_subject.val();

  let message_body = $('#message-body');
  message_body = message_body.val();

  let message_type = $('#sel-msg-type option:selected');
  message_type = message_type.val();

  let message_priority = $('#sel-msg-priority option:selected');
  message_priority = message_priority.val();

  let selected_clients = $('#selected-clients-id-array');
  selected_clients = selected_clients.val();

  console.log(`Subject: ${message_subject}\n Message: ${message_body}\n
    Message Type: ${message_type}\n Message Priority: ${message_priority}\n
    Selected Clients: ${selected_clients}\n`);

  $.ajax({


      url:'/dashboard/send_message/',
      // Type of Request
      method: "POST",
      // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
      // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
      headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
      // Pass data to the django function
      data: {message_subject: message_subject,
      message_body: message_body, message_type: message_type, message_priority: message_priority,
      selected_clients: selected_clients },

      // Function to call when to django returns a response to our ajax request.
      success: function (data) {
          //var x = JSON.stringify(data);
          console.log("AJAX RESPONDEED WITH SUCCESS THE QUERY WAS: ");

          // grab reference to the parent div
          let container_block = document.getElementById( 'msg-popup' );

          // clear any outstanding notification boxes before creating a new one
          while (container_block.lastChild)
          {
            container_block.removeChild(container_block.lastChild);
          }

          // set up 'message sent' notification box
          block_to_insert = document.createElement( 'div' );
          block_to_insert.innerHTML = 'Your alert has been sent.' ;
          $(block_to_insert).addClass("msg-succeeded-popup")

          // add notification box
          container_block.appendChild( block_to_insert );

          // function to fade out notification box
          function fade()
          {
            $(block_to_insert).fadeOut("slow");
          }

          // delay for fading effect
          setTimeout(fade, 3000);

          // function to remove the div with the notification box in it after it
          // has faded out
          function remove_block()
          {
            container_block.removeChild(container_block.firstChild);
          }

          // set timer for removal of div
          setTimeout(remove_block, 6000);

          // get html input fields
          let subjectInput = document.getElementById("message-subject");
          let bodyInput = document.getElementById("message-body");
          let msgTypeInput = document.getElementById("sel-msg-type");
          let msgPriorityInput = document.getElementById("sel-msg-priority");
          let selectedClients = document.getElementById("selected-clients-id-array");

          // reset field values to their original states
          subjectInput.value = "";
          bodyInput.value = "";
          $(msgTypeInput)[0].selectedIndex = 0;
          $(msgPriorityInput)[0].selectedIndex = 0;
          $('.selected-sr').remove();
          refreshSelectedClientsAfterSearch();
      },
      // Error handling LOWKEY USELESS
      error: function ( jqXHR, textStatus, errorThrown ) {
          console.log(`Error WITH AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
          var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

          console.log('Error - ' + errorMessage);

          // grab reference to the parent div
          let container_block = document.getElementById( 'msg-popup' );

          // clear any outstanding notification boxes before creating a new one
          while (container_block.lastChild)
          {
            container_block.removeChild(container_block.lastChild);
          }

          // set up 'message failed' notification box
          block_to_insert = document.createElement( 'div' );
          block_to_insert.innerHTML = 'There was an error when sending your alert. Please try again.' ;
          $(block_to_insert).addClass("msg-failed-popup")

          // add notification box
          container_block.appendChild( block_to_insert );

          // function to fade out notification box
          function fade()
          {
            $(block_to_insert).fadeOut("slow");
          }

          // delay for fading effect
          setTimeout(fade, 3000);

          // function to remove the div with the notification box in it after it
          // has faded out
          function remove_block()
          {
            container_block.removeChild(container_block.firstChild);
          }

          // set timer for removal of div
          setTimeout(remove_block, 6000);
      }
  });
}

function assignSearchFilterListeners()
{
    $("[id$='-filter-pattern']").each( function()
    {
      //console.log(`Data is a range: ${ $(this).data('isRange') }`);

      $(this).on('click', filterPatternClickEvent);
    });

  }

  // this object auto passed by the .on method.
  function filterPatternClickEvent()
  {

      // Check if user selected or deselected the filter
      if( $(this).is(":checked") )
      {
        //console.log("is Checked");
         // if they selected it, add the search key to the array if it does not exist already, and add the search key within that array.
        // If the filter key array has first element set to false, set it to true, else do nothing.
        updateFilterArray( addFilter=true, $(this).data('queryKey'), $(this).data('queryPattern'));

        updateAppliedFiltersDisplay();

        // Execute a search for all clients but filter the results according to the filter.
        executeSearch(true);

      }
      else
      {
        //console.log("is NOT Checked");
        // If user deselected the filter, remove the filter pattern from the array. Check if any other filters are selected based on selected inputs on the page, do not use array to confirm this.
        updateFilterArray( addFilter=false, $(this).data('queryKey'), $(this).data('queryPattern'));

        updateAppliedFiltersDisplay();

        // Execute a search for all clients but filter the results according to the filter that was removed.
        executeSearch(true);

      }
  }

  function assignSearchFilterRangeListeners()
  {
     // When user lifts up key check inputs. This jquery selects two element each with the specified ids.
     $( '#age-filter-range-pattern-1, #age-filter-range-pattern-2' ).keyup( searchFilterRangeClickEvent );

  }

  function searchFilterRangeClickEvent()
  {
      //console.log(`range value ${event.target.value}`);

      // Check the two range elements to see if they match up
      let rangeIsGood = checkRange( $( '#age-filter-range-pattern-1' ), $( '#age-filter-range-pattern-2' ));

      if( rangeIsGood === 1 )
      {
        searchKeysAndRangePatterns[0] = true;

        let rangeToPush = $('#age-filter-range-pattern-1').val() + '-' + $('#age-filter-range-pattern-2').val();

        searchKeysAndRangePatterns[1] = ['age', rangeToPush ];

        // Execute a search for all clients but filter the results according to the filter removed.
        executeSearch(true);

        // Update the filter display since the user entered a new range
        updateAppliedFiltersDisplay();


        //console.log(`New range key array is ${searchKeysAndRangePatterns}`);

      }
      // If user clears array or enters bad input, clear the array and execute a search again since our filter have changed.
      // If user clears age range or enters bad range, remove the age range filter and rexecute search.
      else if( rangeIsGood === 3 || rangeIsGood === 0)
      {
        searchKeysAndRangePatterns[0] = false;
        searchKeysAndRangePatterns[1] = ['age'];

        //console.log(`New range key array is ${searchKeysAndRangePatterns}`);
        // Execute a search for all clients but filter the results according to the filter removed.
        executeSearch(true);

        // Update the filter display since the user entered a new range
        updateAppliedFiltersDisplay();
      }
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

      $(rangeElem1).attr('class', 'invalid-age-range age-filter-input');
      console.log("Range 1 invalid cus letter")
    }
    if( !range2IsAllNums)
    {
      $(rangeElem2).attr('class', 'invalid-age-range age-filter-input');
      console.log("Range 2 invalid cus letter");
    }

    if( $(rangeElem1).val() === '' && $(rangeElem2).val() === '' )
    {
      $(rangeElem1).attr('class', 'valid-age-range age-filter-input');
      $(rangeElem2).attr('class', 'valid-age-range age-filter-input');
      return 3;
    }


    if( range1IsAllNums && range2IsAllNums)
    {
      validLowerUpper = parseInt( $(rangeElem1).val() ) <= parseInt( $(rangeElem2).val() );

      if( !validLowerUpper )
      {
        $(rangeElem1).attr('class', 'invalid-age-range age-filter-input');
        $(rangeElem2).attr('class', 'invalid-age-range age-filter-input');
        console.log("Ranges invalid lower and upper")
      }
      else if( validLowerUpper )
      {
        $(rangeElem1).attr('class', 'valid-age-range age-filter-input');
        $(rangeElem2).attr('class', 'valid-age-range age-filter-input');

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

        //console.log(`Search key inner array: ${searchKeyInnerArray}`);

        if( searchKeyInnerArray[0] === queryKey )
        {
          searchKeyInnerArray.push(queryPattern);

          //console.log(`Filter array after adding new filter: ${searchKeysAndPatterns}`);

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

        //console.log(`Inner array when removing filter: ${searchKeyInnerArray}`);

        if( searchKeyInnerArray[0] === queryKey )
        {
          // Use filter to remove any elements that are equal to the query pattern.
          searchKeysAndPatterns[filterIndex] = searchKeyInnerArray.filter( currentFilter => {
                return currentFilter != queryPattern;
              }
            );

          //console.log(`Inner array after remove filter ${searchKeysAndPatterns[filterIndex] }`);

          // Break out of the loop. A while loop would have been more appropraite here.
          filterIndex = searchKeysAndPatterns.length;
        }
      }


      //console.log(`Filter array before checking for no filters: ${searchKeysAndPatterns}`);
      // After removing the element from the search pattern array, we need to check if the array is empty and if we should not apply any filters
      // If there are not selected filters set the first element of searchKeysAndPatterns to false else break the loop and do nothing.
      // Start 1 because index 0 just holds a boolean
      for( let filterIndex = 1; filterIndex < searchKeysAndPatterns.length; filterIndex++ )
      {
        // each inner array represents a search key and pattersn to match. ie city could be search key and pattersn to match would be 'mesa' or 'phoenix'
        searchKeyInnerArray = searchKeysAndPatterns[filterIndex];

        //console.log(`Search key inner array: ${searchKeyInnerArray}`);

        // If one of the search key inner arrays has length greater than 1, that means there are still selected filters on the page.
        // Break loop were done.
        if( searchKeyInnerArray.length > 1)
        {
          //console.log(`Filter array has filters still, leave first elem true: ${searchKeysAndPatterns}`);
          return;
        }
      }

      // If we dont return that means there are not applied filters. Set the first elem of the searchKeysAndPatterns Array to false.
      searchKeysAndPatterns[0] = false;

      //console.log(`No filter selected. Setting first elem to false: ${searchKeysAndPatterns}`);
    }

  }

  // Initialize the array that will hold search key categories and selected filters.
  function createSearchKeyCategoryArray()
  {
    $('.filter-pattern-category').each(function()
    {
      searchKeysAndPatterns.push( [ $(this).text().toLowerCase() ] );
    })

  }


  // Initialize the array that will hold search key categories that take ranges as inputs.
  function createSearchKeyRangeArray()
  {
    $('.filter-range-pattern-category').each(function()
    {
      searchKeysAndRangePatterns.push( [ $(this).text().toLowerCase() ] );
    })

    //console.log(`Search key range array is ${searchKeysAndRangePatterns}`);
  }

  function updateAppliedFiltersDisplay()
  {
    let appliedFiltersStr = "Applied Filters: ";

    // If there are filters selected, then index 0 will be true.
    if( searchKeysAndPatterns[0] )
    {

      for( let index = 1 ; index < searchKeysAndPatterns.length; index++ )
      {
        let innerFilterArray = searchKeysAndPatterns[index]

        // If the inner arrays length is == 1 then that means there are not filters applied for that category.
        if( innerFilterArray.length > 1)
        {
          for( let innerIndex in innerFilterArray)
          {
            console.log(`Inner filter array ${innerFilterArray}`);
            console.log(`Inner index ${innerIndex}`);

            if( innerIndex == 0)
            {
              appliedFiltersStr += "<strong>" + innerFilterArray[innerIndex].trim().replace(/^\w/, (c) => c.toUpperCase()) + "</strong>: ";
            }
            // Check if were at end of the array
            else if( innerIndex != (innerFilterArray.length - 1) )
            {
              appliedFiltersStr += innerFilterArray[innerIndex].trim().replace(/^\w/, (c) => c.toUpperCase()) + ", ";
            }
            else
            {
              appliedFiltersStr += " " + innerFilterArray[innerIndex].trim().replace(/^\w/, (c) => c.toUpperCase()) + ". ";
            }
          }
        }
      }

    }
    if( searchKeysAndRangePatterns[0] )
    {

      // Get the age range filter inner array.
      let innerFilterArray = searchKeysAndRangePatterns[1];

      appliedFiltersStr += " <strong>Age: </strong>" + innerFilterArray[1] + ". ";

    }
    // If both filter arrays do not have filters in them, then no filters are selected.
    if( !searchKeysAndRangePatterns[0] && !searchKeysAndPatterns[0])
    {
      appliedFiltersStr += "None"
    }

    $('#appl-filters-display').html( appliedFiltersStr );
  }


  // On refresh, browsers like fire fox auto  fill what was previously entered. This would be ok, expect
  // our inputs work based on click events, when the page refreshes and auto selects the inputs,
  // no click event is fired and the filters will not work.
  function clearFilterInputs()
  {

    $("[id$='-filter-pattern']").each( function()
    {
      $(this).prop("checked", false);

      updateFilterArray( addFilter=false, $(this).data('queryKey'), $(this).data('queryPattern'));


    });


    $( '#age-filter-range-pattern-1,#age-filter-range-pattern-2' ).each( function()
     {
      $(this).val("");
      // Manually reset the range filter array
      searchKeysAndRangePatterns[0] = false;
      searchKeysAndRangePatterns[1] = ['age'];
     });

     updateAppliedFiltersDisplay();

     // Execute a search for all clients but filter the results according to the filter that was removed.
     executeSearch(true);

  }




function executeSearch( showAllResults=false )
{
  //console.log("Search keys is " + search_keys);

  let userInput =  $('#user-search-input').val();

  if(userInput === "" )
  {
    search_result_object = executeFuseSearch(  $('#user-search-input').val(), true );
  }
  else
  {
    search_result_object = executeFuseSearch(  $('#user-search-input').val(), showAllResults );
  }

  //console.log( JSON.stringify(search_result_object ));

  fill_client_results_box( search_result_object );

  plotClientSearchresults( search_result_object );

  refreshSelectedClientsAfterSearch(); // after making a search, clients that were selected are not anymore, call this function to select them.

}

function fill_client_results_box( client_list )
{
  let client_count = 0;
  // Remove previous search results
  $('#search-results-container').empty();

  // Iterate through each result from the users search and create each client element to be dispalyed to the user. Also assign click listeners to each search result so we can keep track of which clients
  // have been selected.
  client_list.forEach( ( result ) => {

    client_count++;


  // Create html element for each search result returned from search.
  let element_to_append = generateSearchElement(result);

    $('#search-results-container').append( element_to_append );

    let clientID = result.item.id;

    // Get the div that contains the search result.
    $(`#sr-btn-${clientID}`).on('click', (event) => {

      // DESELECT A PREVIOUSLY SELECTED CLIENT SEARCH RESULT
      // If the client search result already exist in the selected clients container, remove it.
      // If you query an html element and jquery returns 0 that means the element was not found and we know it does not exist.
      if( $(`#selected-sr-${clientID}`).length )
      {
        toggleAnyClient( clientID );
      }
      else
      {
        toggleAnyClient( clientID );


      }

    })

});

  console.log(`TOTAL CLIENTS IN SR: ${client_count}`);
}

// Takes a result item, toggles the result from selected to unselected or vice versa.
function toggleClientSelection( clientIDInt )
{
  //console.log(`In toggle`);
  // Check search results div for selected element
  let resultIsSelected = false;

  // Get client id as string to compare to data-client-id  attribute on sr elements.
  let clientIDStr = clientIDInt.toString();

  $('#search-results-container').children().each( function(){

      //console.log(`Elements client ID:${$(this).data('clientId')}, Result ID:${clientID}: Comparison: ${ $(this).data('clientId').toString() === clientID }`);

      // Get the client search result element that has the same client id as the client we are selected or deselecting.
      if( $(this).data('clientId').toString() === clientIDStr )
      {

        //console.log(`Found matching element. Client selected: ${ $(this).attr('data-selected-client') } Element id is ${$(this).attr('id') } Client ID is: ${$(this).data('clientId')}`);

        // If client is already selected, deselect it.
        if( $(this).attr('data-selected-client') === "true")
        {
          console.log("Deselecting result");
          deselectClientSearchResult( clientIDInt );
        }
        else // If client is not selected, select them.
        {
          console.log("Selecting result");
          selectClientSearchResult( clientIDInt );
        }
      }
  });
  // Check selected clients div for selected element

}

// Deselects a client search result but does not affect the map.
function deselectClientSearchResult( clientIDInt )
{
  $(`#selected-sr-${clientIDInt}`).remove();
  $(`#sr-${clientIDInt}`).removeClass('sel-sr-color');
  invertPlusBtn( `#sr-btn-${clientIDInt}` );
  $(`#sr-${clientIDInt}`).attr('data-selected-client', 'false');
  toggleSpecificPin( clientIDInt.toString() );

  refreshSelectedClientsString(clientIDInt, false);
}

function selectClientSearchResult( clientIDInt )
{
    $(`#sr-${clientIDInt}`).addClass('sel-sr-color');

   invertPlusBtn( `#sr-btn-${clientIDInt}` );

   toggleSpecificPin( clientIDInt.toString() );

   // Create html element for each search result the user clicks.
   let selected_search_result = generateSelectedSearchElement( getClientSearchResultObjByID( clientIDInt ) );

   // Add the new element that was created by cloning the unselected search result item. Remove the sel-sr-color class from the cloned item.
   $("#selected-clients-container").append( selected_search_result );


   // This is the remove button that is located on the element appened to the selected clients container at the bottom of the page.
   $(`#sel-sr-btn-${clientIDInt}`).on('click', function(event){
      $(`#selected-sr-${clientIDInt}`).remove();
      invertPlusBtn( `#sr-btn-${clientIDInt}`);
      $(`#sr-${clientIDInt}`).removeClass('sel-sr-color');
      toggleSpecificPin( clientIDInt.toString() );
      $(`#sr-${clientIDInt}`).attr('data-selected-client', 'false');
      refreshSelectedClientsString(clientIDInt, false);

         });

   $(`#sr-${clientIDInt}`).attr('data-selected-client', 'true');

   refreshSelectedClientsString(clientIDInt, true);
}

function getClientSearchResultObjByID( clientIDInt )
{
  console.log(`SEARCHING FOR CLIENT ID IS ${parseInt(clientIDInt)}`);

  for( let index = 0; index < search_result_object.length; index++ )
  {
    if(search_result_object[index].item.id === parseInt(clientIDInt) )
    {
      return search_result_object[index];
    }
  }
  return false;

}

function getClientFromAllClients( clientID )
{
  all_clients

  for( let index = 0; index < all_clients.length; index++ )
  {
    if(all_clients[index].id === parseInt(clientID) )
    {
      return all_clients[index];
    }
  }
  return false;
}

function refreshSelectedClientsAfterSearch()
{
  $('.selected-sr').remove(); // remove all previous search results. We are going to recreate them in just a few lines.

  let selectedClientID = $("#selected-clients-id-array").val();

  let selectedClientIDArray = selectedClientID.split(",");

  for( let index = 0; index < selectedClientIDArray; index++ )
  {
    selectedClientIDArray[index] = parseInt(selectedClientIDArray[index]);
  }

  //console.log(`SSSelected clients array ${selectedClientIDArray} length is ${selectedClientIDArray.length}`);

  for( let index = 0; index < selectedClientIDArray.length; index++ )
  {
    let clientID = selectedClientIDArray[index];

    // Only toggle the client if their element exists on the page.
    if( getClientSearchResultObjByID(clientID) != false )
    {
      toggleAnyClient( parseInt(clientID) );
    }
    else
    {
      //console.log(`Client not found`)
    }
  }

  if(  $('.selected-sr').length != selected_client_id_array.length)
  {
    $('#no-selections-showing').removeClass('display-none');
  }
}

// Create html element for each search result returned from search.
function generateSelectedSearchElement(result)
{

  return `<div id="selected-sr-${result.item.id}" data-client-id="${result.item.id}" class="bootstrap-grey-bottom my-1 me-1 ms-5 d-flex flex-row client-sr selected-sr">
            <div class="d-flex flex-column justify-content-center ps-2">
              <div id="sel-sr-btn-${result.item.id}" class="remove-sr-btn"> Remove <i class="px-2 fa-solid fa-xmark"></i></div>
            </div>

            <div class="container">

              <div class="row mb-1">
                <div class="col"> Name: ${result.item.name} </div>
                <div class="col"> Address: ${result.item.unit_num} ${result.item.street} ${result.item.city}, ${result.item.state}, ${result.item.zip_code}</div>
                <div class="col"> Policies: ${result.item.policies}</div>
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
  return `<div id="sr-${result.item.id}" data-selected-client="false" data-client-id="${result.item.id}" class="bootstrap-grey-bottom my-1 me-1 ms-5 d-flex flex-row client-sr">
              <div class="d-flex flex-column justify-content-center ps-2">
                <div id="sr-btn-${result.item.id}" class="select-client-btn plus-btn"> Select <i class="fa-solid fa-plus"></i> </div>
              </div>

              <div class="container">

                <div class="row mb-1">
                  <div class="col"> Name: ${result.item.name} </div>
                  <div class="col-6"> Address: ${result.item.unit_num} ${result.item.street} ${result.item.city}, ${result.item.state}, ${result.item.zip_code}</div>
                  <div class="col"> Policies: ${result.item.policies}</div>
                </div>

                <div class="row mb-1">
                  <div class="col"> Age: ${result.item.age}</div>
                  <div class="col-6"> Birthdate: ${result.item.birthdate}</div>
                  <div class="col"> Gender: ${result.item.gender}</div>
                </div>

                <div class="row">
                  <div class="col"> Notification Status: ${result.item.notification_status}</div>
                  <div class="col-6"> License Number: ${result.item.license_num}</div>
                  <div class="col"> Phone Number: ${result.item.phone}</div>
                </div>

              </div>
          </div>
          `;
}

// Toggles select button on client search results.
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

function refreshSelectedClientsString( clientID, add=true)
{

  if( add )
  {
    // Dont add the selected client if the array already includes the id.
    if( !selected_client_id_array.includes( clientID.toString() ) )
    {
      selected_client_id_array.push( clientID.toString() );
    }
  }
  else
  {
    if( selected_client_id_array.includes( clientID.toString() ))
    {
      let indexOfID = selected_client_id_array.indexOf( clientID.toString() );

      if( indexOfID !== -1)
      {
        selected_client_id_array.splice(indexOfID, 1);
      }
    }
  }

  let client_name_str = "";

  for(let index = 0; index < selected_client_id_array.length; index++ )
  {
    client_name_str += getClientFromAllClients(selected_client_id_array[index]).name + ", ";
  }


  $('#send-message-header').html('Send Message To: ' + client_name_str);

  $("#selected-clients-id-array").val(selected_client_id_array.toString());
}

function addListenerToSearchResultScrollBox()
{

  // If search results container is scrollable, expand it.
  if( $('#search-results-container').hasClass('sr-scroll-box') )
  {
    $('#search-results-container').removeClass('sr-scroll-box');

    $('#expand-sr-btn').html("Minimize Search Results");
  }
  else // If search results container is expanded, minimize it.
  {
    $('#search-results-container').addClass('sr-scroll-box');
    $('#expand-sr-btn').html("Expand Search Results");
  }

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
