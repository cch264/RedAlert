


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

var search_pattern = "";


function executeFuseSearch( user_pattern, useUserInput = false )
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
      if(!useUserInput )
      {
        return fuse.search( user_pattern )
      }
      else
      {
        return fuse.search( search_pattern  );
      }
     
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

    assignSearchFilterListeners();
  });

  function assignSearchFilterListeners()
  {
    $(`#city-filter-dd`).children().each( function(  )
    {
      if( $(this).hasClass('search-pattern') )
      {
        $(this).on('click', function(event){
          // Disable search bar while a search pattern filter is selected.
          search_keys = ['city'];
          search_pattern = $(this).data('filterQuery');

          $(`#user-search-input`).prop('disabled', true);
          $(`#search-input-label`).text('Remove Search Only by Category to type a search query!');

          filterName = $(this).data('filterQuery').charAt(0).toUpperCase() + $(this).data('filterQuery').slice(1);

          // Change select button to display text correctly.
          $('#city-filter-btn-txt').text(`City - ${filterName} Only`);

          // Show filters that were previously selected and hidden
          showHiddenFilters( `#city-filter-dd` );

          $(this).toggle();

          //removeFiltersForCategory();
  
          // Execute search since user is not allowed to enter a search query here 
          // Use custom search pattern instead of user entered one.
          executeSearch(true);
        })
      }
      else if( $(this).hasClass('city-only-filter') )
      {
        $(this).on('click', function(event){

          $(`#user-search-input`).prop('disabled', false);
          $(`#search-input-label`).text(' Search: ');

          showHiddenFilters( `#city-filter-dd` );

          $(this).toggle();

          // City is the only field we want to search by in this case.
          search_keys = ['city'];

          $('#city-filter-btn-txt').text(`Search City Names Only`);
        })
        
      }
      else if( $(this).hasClass('city-all-filter') )
      {
        $(this).on('click', function(event){
          $(`#user-search-input`).prop('disabled', false);
          $(`#search-input-label`).text(' Search: ');

          showHiddenFilters( `#city-filter-dd` );

          $(this).toggle();

          search_keys = search_all_keys;

          $('#city-filter-btn-txt').text(`City - All`);
        })
      }
    })
  }

function removeFiltersForCategory()
{

}

function showHiddenFilters( filterParentID )
{
  $(filterParentID).children().each( function(  )
  {
    // If a filter element is hidden, show it
    if( $(this).is(":hidden"))
    {
      $(this).toggle();
    }
  });

}

function executeSearch( useUserInput = false)
{

  console.log("Search keys is " + search_keys);
  search_result_object = executeFuseSearch(  $('#user-search-input').val(), useUserInput );

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