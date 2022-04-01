
// Assign the save search button a click listener that executes ajax to save the users search to our database.
$('#save-search-btn').on('click', createNewSavedSearch );


function createNewSavedSearch()
{
    // Get the users search query.
    let searchToSave = $('#user-search-input').val();

    $.ajax({


        url:'/dashboard/save_search/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        // Pass data to the django function
        data: {search: searchToSave},

        // Function to call when to django returns a response to our ajax request.
        success: function (data) {
            //var x = JSON.stringify(data);
            console.log("AJAX SAVE SEARCH WAS A SUCCESS " + data['Success']);
        },
        // Error handling LOWKEY USELESS
        error: function ( jqXHR, textStatus, errorThrown ) {
            console.log(`Error WITH SAVE SEARCH AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

            console.log('Error - ' + errorMessage);
        }
    });

    $('#no-saved-searches').remove();
    
    let searchContainer = $('#saved-search-container');

    searchContainer.append(`<li class="list-group-item">${searchToSave}</li>`);

    createPopup( "Succesfully Saved Search!", targetID='popup-container', color='#19E412', fontSize = 30, decreaseOpacity=.03)
}