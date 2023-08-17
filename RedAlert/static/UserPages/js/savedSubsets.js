
window.addEventListener('load', (event) => {
    initializeSavedSubsetModals();
});

var subsetName = "";

function initializeSavedSubsetModals()
{
    $('.saved-subset-modal').each( function(){
        let subsetID = $(this).data('subsetId');

        console.log(`SAVED SUBET ID ${subsetID}`);
        assignSubsetButtonListeners(subsetID);

        fetchClientData(subsetID, "subset");

    })
}


function assignSubsetButtonListeners( subsetID )
{

    //console.log(`ASSIGNIGN SAVED SUBSET LISTNERS ID ${subsetID}`);
    $(`#edit-subset-btn-${subsetID}`).on('click', () => {editSavedSavedSubset(subsetID) });
    $(`#discard-subset-${subsetID}`).on('click', () => { discardSavedSubset(subsetID) });
    $(`#save-subset-btn-${subsetID}`).on('click', ()=> { validateSavedSubset(subsetID) });
    $(`#delete-subset-${subsetID}`).on('click', () => { deleteSubsetModal( subsetID ) } );
}

function editSavedSavedSubset(subsetID)
{

    // Save the subset query information before allowing edits.
    subsetName = $(`#name-for-subset-to-save-${subsetID}`).val();

    $(`#name-for-subset-to-save-${subsetID}`).prop('disabled', false);

    toggleSubsetModalHeader( subsetID );
    toggleSubsetButtons( subsetID );
}


function discardSavedSubset( subsetID )
{
    let discardChanges = confirm('Are you sure you would like to discard your changes?');

    if( discardChanges )
    {
        toggleSubsetButtons( subsetID );

        $(`#name-for-subset-to-save-${subsetID}`).prop('disabled', true);
    
        $(`#name-for-subset-to-save-${subsetID}`).val(subsetName);

        toggleSubsetModalHeader( subsetID );
    }

}

function toggleSubsetButtons( subsetID )
{
   
    $(`#save-subset-btn-${subsetID}`).toggle();
    $(`#discard-subset-${subsetID}`).toggle();
    $(`#delete-subset-${subsetID}`).toggle();

    $(`#close-subset-modal-btn-${subsetID}`).toggle();
    $(`#edit-subset-btn-${subsetID}`).toggle();

}

function toggleSubsetModalHeader( subsetID )
{
    let currentHeader = $(`#subset-modal-header-mode-${subsetID}`).text();

    if( currentHeader === "View")
    {   
        $(`#subset-modal-header-mode-${subsetID}`).text('Edit');
    }
    else
    {
        $(`#subset-modal-header-mode-${subsetID}`).text('View');
    }
}

function validateSavedSubset(subsetID)
{
    let warningMessage = "";
    let validationSuccessful = true;

    if( $(`#name-for-subset-to-save-${subsetID}`).val() == '' )
    {
        validationSuccessful = false;
        warningMessage += "<li>Name Your Subset: </li>";
    }


    if( validationSuccessful )
    {
        // If saved subset validated then create a new saved subset in the db.
        updateSavedSubset(subsetID);

        $(`#save-subset-modal-${subsetID}`).modal('hide');

        createPopup("Successfully Updated Subset!", "popup-container", "#11F3A9", 25);


        closeAllClosablePopups();

        // Hide delete, save, and discard button after editing saved subset.
        toggleSubsetButtons(subsetID);

        //
        $(`#saved-subset-${subsetID}`).text($(`#name-for-subset-to-save-${subsetID}`).val());

        // Disable inputs after saving edits.
        $(`#display-user-subset-to-save-${subsetID}`).prop('disabled', true);
        $(`#name-for-subset-to-save-${subsetID}`).prop('disabled', true);


    }
    else
    {

        let popupMessage = `<div> Please Fill Out the Following Fields:  <ul>${warningMessage}</ul> </div>`;

        createClosablePopup( popupMessage , targetID=`closable-popup-container-saved-subset-${subsetID}`, color='#BC1F43', fontSize = 22, fontColor='#FFFFFF')
    }
}


function updateSavedSubset( subsetID )
{
    let subsetName = $(`#name-for-subset-to-save-${subsetID}`).val();

    $.ajax({

        url:'/user_pages/update_subset/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        // Pass data to the django function
        data: {subsetID: subsetID, subsetName: subsetName},

        // Function to call when to django returns a response to our ajax request.
        success: function (data) {
            //var x = JSON.stringify(data);
            console.log("AJAX UPDATE SAVED SUBSET WAS A SUCCESS " + data['Success']);
        },
        // Error handling LOWKEY USELESS
        error: function ( jqXHR, textStatus, errorThrown ) {
            console.log(`Error WITH UPDATING SAVED SUBSET AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

            console.log('Error - ' + errorMessage);
        }
    });
}


function deleteSubsetModal( subsetID )
{
    let deleteSubset = confirm('Are you sure your would like to delete this saved subset?');

    if( deleteSubset )
    {
        $(`#save-subset-modal-${subsetID}`).modal('hide');

        createPopup("Successfully Deleted Saved Subset!", "popup-container", "#11F3A9", 25);

        closeAllClosablePopups();

        $(`#saved-subset-${subsetID}`).remove();

        // Display message to user if they delete all their saved subsetes.
        if( $(`#subset-list > li`).length === 0 )
        {
            console.log(`No saved subsetes left!!!`);
            $(`#subset-list`).append(`<li id="no-saved-subsets" class="list-group-item">You dont have any saved subsetes</li>`);
        }

        deleteSavedSubset( subsetID );
    }
}


function deleteSavedSubset( subsetID )
{
    $.ajax({

        url:'/user_pages/delete_subset/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        // Pass data to the django function
        data: {subsetID: subsetID},

        // Function to call when to django returns a response to our ajax request.
        success: function (data) {
            //var x = JSON.stringify(data);
            console.log("AJAX DELETE DELETE SUBSET WAS A SUCCESS " + data['Success']);
        },
        // Error handling LOWKEY USELESS
        error: function ( jqXHR, textStatus, errorThrown ) {
            console.log(`Error WITH DELETING SUBSET AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

            console.log('Error - ' + errorMessage);
        }
    });
}