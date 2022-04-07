
window.addEventListener('load', (event) => {
    initializeSavedSearchModals();
});

var searchName = "";
var searchQuery = "";

function initializeSavedSearchModals()
{
    $('.saved-search-modal').each( function(){
        let searchID = $(this).data('searchId');

        console.log(`SAVED SEARCH ID ${searchID}`);
        assignSearchButtonListeners(searchID);

    })
}


function assignSearchButtonListeners( searchID )
{
    console.log(`ASSIGNIGN SAVED SEARCHES LISTNERS ID ${searchID}`);
    $(`#edit-search-btn-${searchID}`).on('click', () => {editSavedSavedSearch(searchID) });
    $(`#discard-search-${searchID}`).on('click', () => { discardSavedSearch(searchID) });
    $(`#save-search-btn-${searchID}`).on('click', ()=> { validateSavedSearch(searchID) });
    $(`#delete-search-${searchID}`).on('click', () => { deleteSearchModal( searchID ) } );
}

function editSavedSavedSearch(searchID)
{

    console.log(`EDITING SAVED SAVED SEARCH ID ${searchID}`);
    // Save the search query information before allowing edits.
    searchName = $(`#name-for-search-to-save-${searchID}`).val();
    searchQuery = $(`#display-user-search-to-save-${searchID}`).val();

    // Enable inputs for editing.
    $(`#display-user-search-to-save-${searchID}`).prop('disabled', false);
    $(`#name-for-search-to-save-${searchID}`).prop('disabled', false);

    toggleSearchModalHeader( searchID );
    toggleSearchButtons( searchID );
}


function discardSavedSearch( searchID )
{
    let discardChanges = confirm('Are you sure you would like to discard your changes?');

    if( discardChanges )
    {
        toggleSearchButtons( searchID );
    
        $(`#display-user-search-to-save-${searchID}`).prop('disabled', true);
        $(`#name-for-search-to-save-${searchID}`).prop('disabled', true);
    
        $(`#name-for-search-to-save-${searchID}`).val(searchName);
        $(`#display-user-search-to-save-${searchID}`).val(searchQuery);

        toggleSearchModalHeader( searchID );
    }

}

function toggleSearchButtons( searchID )
{
   
    $(`#save-search-btn-${searchID}`).toggle();
    $(`#discard-search-${searchID}`).toggle();
    $(`#delete-search-${searchID}`).toggle();

    $(`#close-search-modal-btn-${searchID}`).toggle();
    $(`#edit-search-btn-${searchID}`).toggle();
    

}

function toggleSearchModalHeader( searchID )
{
    let currentHeader = $(`#search-modal-header-mode-${searchID}`).text();

    if( currentHeader === "View")
    {   
        $(`#search-modal-header-mode-${searchID}`).text('Edit');
    }
    else
    {
        $(`#search-modal-header-mode-${searchID}`).text('View');
    }
}

function validateSavedSearch(searchID)
{
    let warningMessage = "";
    let validationSuccessful = true;

    if( $(`#name-for-search-to-save-${searchID}`).val() == '' )
    {
        validationSuccessful = false;
        warningMessage += "<li>Name Your Search Query: </li>";
    }
    if( $(`#display-user-search-to-save-${searchID}`).val() == '' )
    {
        validationSuccessful = false;
        warningMessage += "<li>Search Query to Save: </li>";
    }


    if( validationSuccessful )
    {
        // If saved search validated then create a new saved search in the db.
        updateSavedSearch(searchID);

        $(`#save-search-modal-${searchID}`).modal('hide');

        createPopup("Successfully Updated Saved Search!", "popup-container", "#11F3A9", 25);


        closeAllClosablePopups();

        // Hide delete, save, and discard button after editing saved search.
        toggleSearchButtons(searchID);

        $(`#saved-search-${searchID}`).text($(`#name-for-search-to-save-${searchID}`).val());

        // Disable inputs after saving edits.
        $(`#display-user-search-to-save-${searchID}`).prop('disabled', true);
        $(`#name-for-search-to-save-${searchID}`).prop('disabled', true);


    }
    else
    {

        let popupMessage = `<div> Please Fill Out the Following Fields:  <ul>${warningMessage}</ul> </div>`;

        createClosablePopup( popupMessage , targetID=`closable-popup-container-saved-search-${searchID}`, color='#BC1F43', fontSize = 22, fontColor='#FFFFFF')
    }
}


function updateSavedSearch( searchID )
{
    let searchQuery = $(`#display-user-search-to-save-${searchID}`).val();
    let searchName = $(`#name-for-search-to-save-${searchID}`).val();

    $.ajax({

        url:'/user_pages/update_search/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        // Pass data to the django function
        data: {searchID: searchID, searchName: searchName, searchQuery: searchQuery},

        // Function to call when to django returns a response to our ajax request.
        success: function (data) {
            //var x = JSON.stringify(data);
            console.log("AJAX UPDATE SAVED SEARCH WAS A SUCCESS " + data['Success']);
        },
        // Error handling LOWKEY USELESS
        error: function ( jqXHR, textStatus, errorThrown ) {
            console.log(`Error WITH UPDATING SAVED SEARCH AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

            console.log('Error - ' + errorMessage);
        }
    });
}


function deleteSearchModal( searchID )
{
    let deleteSearch = confirm('Are you sure your would like to delete this saved search?');

    if( deleteSearch )
    {
        $(`#save-search-modal-${searchID}`).modal('hide');

        createPopup("Successfully Deleted Saved Search!", "popup-container", "#11F3A9", 25);

        closeAllClosablePopups();

        $(`#saved-search-${searchID}`).remove();

        // Display message to user if they delete all their saved searches.
        if( $(`#search-list > li`).length === 0 )
        {
            console.log(`No saved searches left!!!`);
            $(`#search-list`).append(`<li id="no-saved-searches" class="list-group-item">You dont have any saved searches</li>`);
        }

        deleteSavedSearch( searchID );
    }
}


function deleteSavedSearch( searchID )
{
    $.ajax({

        url:'/user_pages/delete_search/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        // Pass data to the django function
        data: {searchID: searchID},

        // Function to call when to django returns a response to our ajax request.
        success: function (data) {
            //var x = JSON.stringify(data);
            console.log("AJAX DELETE SAVED SEARCH WAS A SUCCESS " + data['Success']);
        },
        // Error handling LOWKEY USELESS
        error: function ( jqXHR, textStatus, errorThrown ) {
            console.log(`Error WITH DELETING SAVED SEARCH AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

            console.log('Error - ' + errorMessage);
        }
    });
}