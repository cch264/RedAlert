
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
          "email",
          "age"
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


window.addEventListener('load', (event) => {
    console.log('page is fully loaded');
    // Overwrite the forms on submit method so we can add our custom ajax function to execute on form submit.
    $('#user-search-box-form').on('submit', function(e)
        {
            // PREVENT the default behavior of the form. Without this line, ajax wont work right or FUSE.js.
            e.preventDefault();

            //executeSearchAjax();

            search_result_object = executeFuseSearch(  $('#user-search-input').val() );

            console.log(`Search result leng ${search_result_object.length }`)


            search_result_object.forEach( ( result ) => {
                console.log(`The result: ${JSON.stringify(result.item) }`);
                console.log(`id ${ result.item.id }`);
                console.log(`name ${ result.item.name }`);
                console.log(`email ${ result.item.email }`);
                console.log(`age ${ result.item.age }`);

            });
        })
  });

function executeSearchAjax() {
    $.ajax({

        
        url:'/dashboard/execute_search/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
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