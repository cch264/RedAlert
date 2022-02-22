
list = [
    {
      "title": "The DaVinci Code",
      "author": {
        "firstName": "Dan",
        "lastName": "Brown"
      }
    },
    {
      "title": "Angels & Demons",
      "author": {
        "firstName": "Dan",
        "lastName": "Brown"
      }
    },
    {
      "title": "The Silmarillion",
      "author": {
        "firstName": "J.R.R",
        "lastName": "Tolkien"
      }
    },
    {
      "title": "Syrup",
      "author": {
        "firstName": "Max",
        "lastName": "Barry"
      }
    },
    {
      "title": "The Lost Symbol",
      "author": {
        "firstName": "Dan",
        "lastName": "Brown"
      }
    },
    {
      "title": "The Book of Lies",
      "author": {
        "firstName": "Brad",
        "lastName": "Meltzer"
      }
    },
    {
      "title": "Lamb",
      "author": {
        "firstName": "Christopher",
        "lastName": "Moore"
      }
    },
    {
      "title": "Fool",
      "author": {
        "firstName": "Christopher",
        "lastName": "Moore"
      }
    },
    {
      "title": "Incompetence",
      "author": {
        "firstName": "Rob",
        "lastName": "Grant"
      }
    },
    {
      "title": "Fat",
      "author": {
        "firstName": "Rob",
        "lastName": "Grant"
      }
    },
    {
      "title": "Colony",
      "author": {
        "firstName": "Rob",
        "lastName": "Grant"
      }
    },
    {
      "title": "Backwards, Red Dwarf",
      "author": {
        "firstName": "Rob",
        "lastName": "Grant"
      }
    },
    {
      "title": "The Grand Design",
      "author": {
        "firstName": "Stephen",
        "lastName": "Hawking"
      }
    },
    {
      "title": "The Book of Samson",
      "author": {
        "firstName": "David",
        "lastName": "Maine"
      }
    },
    {
      "title": "The Preservationist",
      "author": {
        "firstName": "David",
        "lastName": "Maine"
      }
    },
    {
      "title": "Fallen",
      "author": {
        "firstName": "David",
        "lastName": "Maine"
      }
    },
    {
      "title": "Monster 1959",
      "author": {
        "firstName": "David",
        "lastName": "Maine"
      }
    }
  ]

function executeFuseSearch( user_pattern )
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
        keys: [
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
      };
    
      //console.log(`JSON STRING ${ $('#client-json-input').val() }`);

      //console.log(`JSON  ${ JSON.parse( $('#client-json-input').val()) }`);

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

            //executeSearchAjax();

            search_result_object = executeFuseSearch(  $('#user-search-input').val() );

            console.log(`Search result leng ${search_result_object.length }`);

            fill_client_results_box( search_result_object );
        })
  });


function fill_client_results_box( client_list )
{
  // Remove previous search results
  $('#search-results-container').empty();


  client_list.forEach( ( result ) => {



  let element_to_append = `
    <div id="sr-${result.item.id}" data-client-id="${result.item.id}" class="bootstrap-grey-bottom my-1 me-1 ms-5 d-flex flex-row client-sr">
                <input type="checkbox" class="me-5 ms-3" >
                  
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

    /*
  let element_to_append = 
            "<div class=\"client-sr\"  data-client-id=\"" + result.item.id + "\" class=\"bootstrap-grey-bottom my-1 me-1 ms-5\">
              <input type=\"checkbox\" class=\"me-5 ms-3\" >
                 <span class=\"mx-5\"> Name: " + result.item.name +
                "</span> <span class=\"mx-5\"> Address:"+ result.item.unit_num+ " " + result.item.street +" " + result.item.city  
                    + ", " + result.item.state+", " +result.item.zip_code +"</span> 
                <span class=\"mx-5\"> Policies: " + result.item.polcies +"</span></div>";
    */

    $('#search-results-container').append( element_to_append );

    // Get the div that contains the search result.
    $(`#sr-${result.item.id}`).on('click', (event) => {

      

      if( $(`#selected-sr-${result.item.id}`).length )
      {
        $(`#selected-sr-${result.item.id}`).remove();
      }
      else
      {
        $("#selected-clients-container").append( $(`#sr-${result.item.id}`).clone().attr('id', `selected-sr-${result.item.id}` ) );
        // Remove all ids from the container
        $("#selected-clients-id-array").val("");

        let clientIdString = "";

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

    })

    console.log(`The result: ${JSON.stringify(result.item) }`);
    //console.log(`id ${ result.item.id }`);
    //console.log(`name ${ result.item.name }`);
    //console.log(`email ${ result.item.email }`);
    //console.log(`age ${ result.item.age }`);

});
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