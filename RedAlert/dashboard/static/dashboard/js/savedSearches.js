

window.addEventListener('load', (event) => {

    $('#open-save-search-modal').on('click', initializeSaveSearchModal )
    
    // Assign the save search button a click listener that executes ajax to save the users search to our database.
    $('#save-search-btn').on('click', validateNewSavedSearch );
    
    $('#save-search-discard').on('click', clearNewSavedSearchModal);


    $('.saved-search').on('click', executeSavedSearch );

});


function initializeSaveSearchModal()
{
    let searchToSave = $('#user-search-input').val();

    // Place the users query into the input so they can edit the search query before saving
    $('#display-user-search-to-save').val(searchToSave);
}


function createNewSavedSearch()
{
    // Get the users search query from the modal just in case they edit their search query.
    let searchToSave = $('#display-user-search-to-save').val();
    let searchToSaveName = $('#name-for-search-to-save').val();

    $.ajax({


        url:'/dashboard/save_search/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        // Pass data to the django function
        data: {search: searchToSave, name: searchToSaveName},

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

    // Remove element that indicates there are no saved searches if it exists.
    $('#no-saved-searches').remove();
    
    let searchContainer = $('#saved-search-container');

    // Add the new saved search to the list of saved searches.
    searchContainer.append(`<div class="saved-search" data-search-query="${searchToSave}">${searchToSaveName}</li>`);

    createPopup( "Succesfully Saved Search!", targetID='popup-container', color='#11F3A9', fontSize = 30, decreaseOpacity=.03);

    $('.saved-search').on('click', executeSavedSearch );

    // Reset the name of the search to save to an empty string so when the user creates another saved search they dont see the old name they entered.
    $(`#name-for-search-to-save`).val('');

    // Hide the save search modal after saving a search.
    $('#save-search-modal').modal('hide');
}


function validateNewSavedSearch()
{
    let warningMessage = "";
    let validationSuccessful = true;

    if( $('#name-for-search-to-save').val() == '' )
    {
        validationSuccessful = false;
        warningMessage += "<li>Name Your Search Query: </li>";
    }
    if( $('#display-user-search-to-save').val() == '' )
    {
        validationSuccessful = false;
        warningMessage += "<li>Search Query to Save: </li>";
    }


    if( validationSuccessful )
    {
        // If saved search validated then create a new saved search in the db.
        createNewSavedSearch();
        closeAllClosablePopups(); // close any warning popups on the page.
    }
    else
    {

        let popupMessage = `<div> Please Fill Out the Following Fields:  <ul>${warningMessage}</ul> </div>`;

        createClosablePopup( popupMessage , targetID='closable-popup-container-saved-search', color='#BC1F43', fontSize = 22, fontColor='#FFFFFF')
    }
    
}


// Reset all inputs so they are empty when user discards their saved search.
function clearNewSavedSearchModal()
{
    // Clear the inputs if the user discards their changes when saving a search.
    $('#name-for-search-to-save').val('');
    $('#display-user-search-to-save').val('');
}


// Fires when the user clicks a saved search element from the side bar.
function executeSavedSearch( event )
{   
    // Get the search element that was clicked.
    let elementClicked = event.target;

    let searchQuery = $(elementClicked).data('searchQuery');

    $('#user-search-input').val( searchQuery );

    // Execute the search now that we have placed the users query in the search bar.
    executeSearch();


}