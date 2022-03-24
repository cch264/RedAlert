var currentRecurringAutoStatus = "Viewing";

var currentOneTimeAutoStatus = "Viewing";

var currentRecurringAuto;

var currentOneTimeAuto;

function oneTimeAutoData( name, sub, msg, type, priority, send_date)
{
    this.name = name;
    this.sub = sub;
    this.msg = msg;
    this.type = type;
    this.priority = priority;
    this.freq = "once";
    this.send_date = send_date;

}

function recurringAutoData( name, sub, msg, type, priority, start_date, unit )
{
    this.name = name;
    this.sub = sub;
    this.msg = msg;
    this.type = type;
    this.priority = priority;
    this.freq = "many";
    this.start_date = start_date;
    this.unit = unit;

}

window.addEventListener('load', (event) => {

    // Assigns click listeners to the buttons and select elements inside the modal 
    initializeAutomationModal();

    initializeOneTimeAutoModals();
    initializeRecurringAutoModals();

})


function initializeAutomationModal()
{

    $('.one-time-auto-modal').each(function(){
        let oneTimeAutoID = $(this).data('autoId');
        //console.log(`MODAL ID IS ${oneTimeAutoID}`);

        $('#auto-sel-msg-frequency-' + oneTimeAutoID).on('change', ()=> toggleAutomationTypeOneTime( oneTimeAutoID ) );


    });

    $('.recurring-auto-modal').each(function(){
        let recurringAutoID = $(this).data('autoId');

        //console.log(`MODAL ID IS ${recurringAutoID}`);

        $('#auto-many-sel-msg-frequency-' + recurringAutoID).on('change', ()=> toggleAutomationRecurring( recurringAutoID ) )
    })
    //$('#auto-modal-cancel').on('click', clearModalInputs )
   // $('#auto-send-msg').on('click', updateAutomation);
}



function toggleAutomationTypeOneTime(autoID)
{
    if( $('#auto-sel-msg-frequency-' + autoID).val() === "once" )
    {
        $('#auto-send-msg-once-inputs-' + autoID).removeClass('display-none');
        $('#auto-send-msg-many-inputs-' + autoID).addClass('display-none');
    }
    else if( $('#auto-sel-msg-frequency-' + autoID).val() === "many" )
    {
        $('#auto-send-msg-many-inputs-' + autoID).removeClass('display-none');
        $('#auto-send-msg-once-inputs-' + autoID).addClass('display-none');
    }
    else
    {
        $('#auto-send-msg-once-inputs-' + autoID).addClass('display-none');
        $('#auto-send-msg-many-inputs-' + autoID).addClass('display-none');
    }
}


function toggleAutomationRecurring(autoID)
{
    if( $('#auto-many-sel-msg-frequency-' + autoID).val() === "once" )
    {
        $('#auto-many-send-msg-once-inputs-' + autoID).removeClass('display-none');
        $('#auto-send-msg-many-inputs-' + autoID).addClass('display-none');
    }
    else if( $('#auto-many-sel-msg-frequency-' + autoID).val() === "many" )
    {
        $('#auto-many-send-recurring-inputs-' + autoID).removeClass('display-none');
        $('#auto-many-send-msg-once-inputs-' + autoID).addClass('display-none');
    }
    else
    {
        $('#auto-many-send-msg-once-inputs-' + autoID).addClass('display-none');
        $('#auto-many-send-recurring-inputs-' + autoID).addClass('display-none');
    }
}


function initializeOneTimeAutoModals()
{
   $('.one-time-auto-modal').each( function(){

    let oneTimeAutoID = $(this).data('autoId');

    $('#auto-sel-msg-frequency-' + oneTimeAutoID).val('once').change();
    $('#auto-sel-msg-type-' + oneTimeAutoID).val($('#auto-sel-msg-type-val-' + oneTimeAutoID).val()).change();
    $('#auto-sel-msg-priority-' + oneTimeAutoID).val( $('#auto-sel-msg-priority-val-' + oneTimeAutoID).val() ).change();
    $('#auto-send-once-date-' + oneTimeAutoID).val( $('#auto-send-once-date-val-' + oneTimeAutoID).val() ).change();

    assignOneTimeModalButtonListeners( oneTimeAutoID )

   })

  
}

function initializeRecurringAutoModals()
{
    $('.recurring-auto-modal').each( function(){

        let recurringAutoID = $(this).data('autoId');

       // console.log(`AUTO ID: ${recurringAutoID}`);

        $('#auto-many-sel-msg-frequency-' + recurringAutoID).val('many').change();
        $('#auto-many-sel-msg-type-' + recurringAutoID).val($('#auto-many-sel-msg-type-val-' + recurringAutoID).val()).change();
        $('#auto-many-sel-msg-priority-' + recurringAutoID).val( $('#auto-many-sel-msg-priority-val-' + recurringAutoID).val() ).change();
        $('#auto-many-send-many-date-' + recurringAutoID).val( $('#auto-many-send-many-date-val-' + recurringAutoID).val() ).change();
        $('#auto-many-send-freq-unit-' + recurringAutoID).val( $('#auto-many-send-freq-unit-val-' + recurringAutoID).val() ).change();

        assignRecurrModalButtonListeners(recurringAutoID);
        

    })


}


//////////////////////////// START Editing One Time Automation Code Below ///////////////////////////////////////


// Get the values in the modal so they can be restored if the user discards their edits.
function editOneTimeModal( autoID )
{
    currentOneTimeAuto = createOneTimeAutoInfoObject(autoID);

    //console.log(`Current Auot info ${JSON.stringify(currentRecurringAuto)}`);

    toggleOneTimeModalInputs( autoID, false );


    toggleOneTimeModalHeader( autoID );
}

function stopEditingOneTimeModal( autoID )
{
    
    let alertResponse = confirm('Are you sure you would like to discard your changes?');

    console.log(`Alert response is ${alertResponse}`);

    if( alertResponse )
    {
        toggleOneTimeEditButton( autoID );  
        
        toggleOneTimeModalHeader( autoID ); 
    
        restoreOneTimeModalInputs( autoID );
    
        toggleOneTimeModalInputs( autoID, true );
    }

}

//function oneTimeAutoData( name, sub, msg, type, priority, send_date)
function createOneTimeAutoInfoObject(autoID)
{
    return  new oneTimeAutoData(
        $(`#auto-name-${autoID}`).val(),
        $(`#auto-message-subject-${autoID}`).val(),
        $(`#auto-message-body-${autoID}`).val(),
        $(`#auto-sel-msg-type-${autoID}`).val(),
        $(`#auto-sel-msg-priority-${autoID}`).val(),
        $(`#auto-send-once-date-${autoID}`).val(),
        );
}

function toggleOneTimeModalInputs( autoID, disableInputs )
{   
    $(`#auto-name-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-message-subject-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-message-body-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-sel-msg-type-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-sel-msg-priority-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-send-once-date-${autoID}`).prop('disabled', disableInputs);

}

function toggleOneTimeModalHeader( autoID )
{
    if(currentOneTimeAutoStatus === "Viewing")
    {   
        currentOneTimeAutoStatus = "Editing";
        $(`#auto-header-${autoID}`).text(currentOneTimeAutoStatus);
    }
    else
    {
        currentOneTimeAutoStatus = "Viewing";
        $(`#auto-header-${autoID}`).text(currentOneTimeAutoStatus);
    }
}

function toggleOneTimeEditButton( autoID )
{
    // If discard changes is not visible, make it visible and hid the edit and close buttons since we are entering edit mode.
    if( !$(`#auto-modal-discard-changes-${autoID}`).is(":visible") )
    {
        $(`#auto-modal-close-${autoID}`).hide();
        $(`#auto-modal-edit-${autoID}`).hide();

        $(`#auto-modal-discard-changes-${autoID}`).show();
        $(`#auto-save-changes-${autoID}`).show();
        $(`#auto-delete-${autoID}`).show();
    }
    else
    {
        $(`#auto-modal-close-${autoID}`).show();
        $(`#auto-modal-edit-${autoID}`).show();

        $(`#auto-modal-discard-changes-${autoID}`).hide();
        $(`#auto-save-changes-${autoID}`).hide();
        $(`#auto-delete-${autoID}`).hide();
    }
}


function assignOneTimeModalButtonListeners( autoID )
{
    $(`#auto-modal-edit-${autoID}`).on('click', () => { editOneTimeModal(autoID); toggleOneTimeEditButton(autoID) } );
    $(`#auto-modal-discard-changes-${autoID}`).on('click', () => { stopEditingOneTimeModal( autoID )} );
    $(`#auto-save-changes-${autoID}`).on('click', () => { validateAutomation(autoID, "once") } );
    $(`#auto-delete-${autoID}`).on('click', ()=> {deleteOneTimeAutomation(autoID)} );
}



function restoreOneTimeModalInputs( autoID )
{

    $(`#auto-name-${autoID}`).val( currentOneTimeAuto.name);
    $(`#auto-message-subject-${autoID}`).val( currentOneTimeAuto.sub);
    $(`#auto-message-body-${autoID}`).val( currentOneTimeAuto.msg);
    $(`#auto-sel-msg-type-${autoID}`).val( currentOneTimeAuto.type);
    $(`#auto-sel-msg-priority-${autoID}`).val( currentOneTimeAuto.priority);
    $(`#auto-send-once-date-${autoID}`).val( currentOneTimeAuto.send_date);



    currentOneTimeAuto = null;

}

function deleteOneTimeAutomation( autoID )
{
    let confirmDelete = confirm("Are you sure you would like to delete this automation?");

    if( confirmDelete )
    {
        $(`#one-time-auto-${autoID}`).modal('hide');
        $(`#one-time-auto-li-${autoID}`).remove();
        deleteAutomation(autoID, "one");
        createPopup('Successfully Deleted Automation!', targetID='popup-container', color='#11F3A9');
    }
}


//////////////////////////// END Editing One Time Automation Code Below ///////////////////////////////////////







































































//////////////////////////// START Editing Recurring Automation Code Below ///////////////////////////////////////


// Get the values in the modal so they can be restored if the user discards their edits.
function editRecurModal( autoID )
{
    currentRecurringAuto = createRecurrAutoInfoObject(autoID);

    //console.log(`Current Auot info ${JSON.stringify(currentRecurringAuto)}`);

    toggleRecurringModalInputs( autoID, false );


    toggleManyModalHeader( autoID );
}

function stopEditingRecurModal( autoID )
{
    
    let alertResponse = confirm('Are you sure you would like to discard your changes?');

    console.log(`Alert response is ${alertResponse}`);

    if( alertResponse )
    {
        toggleRecurrEditButton( autoID );  
        
        toggleManyModalHeader( autoID ); 
    
        restoreRecurModalInputs( autoID );
    
        toggleRecurringModalInputs( autoID, true );
    }

}


function createRecurrAutoInfoObject(autoID)
{
    return  new recurringAutoData(
        $(`#auto-many-name-${autoID}`).val(),
        $(`#auto-many-message-subject-${autoID}`).val(),
        $(`#auto-many-message-body-${autoID}`).val(),
        $(`#auto-many-sel-msg-type-${autoID}`).val(),
        $(`#auto-many-sel-msg-priority-${autoID}`).val(),
        $(`#auto-many-send-many-date-${autoID}`).val(),
        $(`#auto-many-send-freq-unit-${autoID}`).val()
        );
}

function toggleRecurringModalInputs( autoID, disableInputs )
{

    $(`#auto-many-name-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-many-message-subject-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-many-message-body-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-many-sel-msg-type-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-many-sel-msg-priority-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-many-send-many-date-${autoID}`).prop('disabled', disableInputs);
    $(`#auto-many-send-freq-unit-${autoID}`).prop('disabled', disableInputs);

}

function toggleManyModalHeader( autoID )
{
    if(currentRecurringAutoStatus === "Viewing")
    {   
        currentRecurringAutoStatus = "Editing";
        $(`#auto-many-header-${autoID}`).text(currentRecurringAutoStatus);
    }
    else
    {
        currentRecurringAutoStatus = "Viewing";
        $(`#auto-many-header-${autoID}`).text(currentRecurringAutoStatus);
    }
}

function toggleRecurrEditButton( autoID )
{
    // If discard changes is not visible, make it visible and hid the edit and close buttons since we are entering edit mode.
    if( !$(`#auto-many-modal-discard-changes-${autoID}`).is(":visible") )
    {
        $(`#auto-many-modal-close-${autoID}`).hide();
        $(`#auto-many-edit-auto-${autoID}`).hide();

        $(`#auto-many-modal-discard-changes-${autoID}`).show();
        $(`#auto-many-save-changes-${autoID}`).show();
        $(`#auto-many-delete-${autoID}`).show();
    }
    else
    {
        $(`#auto-many-modal-close-${autoID}`).show();
        $(`#auto-many-edit-auto-${autoID}`).show();

        $(`#auto-many-modal-discard-changes-${autoID}`).hide();
        $(`#auto-many-save-changes-${autoID}`).hide();
        $(`#auto-many-delete-${autoID}`).hide();
    }
}


function assignRecurrModalButtonListeners( autoID )
{
    $(`#auto-many-edit-auto-${autoID}`).on('click', () => { editRecurModal(autoID); toggleRecurrEditButton(autoID) } );
    $(`#auto-many-modal-discard-changes-${autoID}`).on('click', () => { stopEditingRecurModal( autoID )} );
    $(`#auto-many-save-changes-${autoID}`).on('click', () => { validateAutomation( autoID, "many" ) } );
    $(`#auto-many-delete-${autoID}`).on('click', ()=> {deleteRecurringAutomation(autoID)} );
}



function restoreRecurModalInputs( autoID )
{
    //$('#auto-many-sel-msg-frequency-' + autoID).val('many').change();
    $(`#auto-many-message-subject-${autoID}`).val( currentRecurringAuto.sub);
    $(`#auto-many-message-body-${autoID}`).val( currentRecurringAuto.msg);
    $(`#auto-many-name-${autoID}`).val( currentRecurringAuto.name ).change();
    $('#auto-many-sel-msg-type-' + autoID).val( currentRecurringAuto.type ).change();
    $('#auto-many-sel-msg-priority-' + autoID).val( currentRecurringAuto.priority ).change();
    $('#auto-many-send-many-date-' + autoID).val( currentRecurringAuto.start_date  ).change();
    $('#auto-many-send-freq-unit-' + autoID).val( currentRecurringAuto.unit ).change();


    currentRecurringAuto = null;

}

function deleteRecurringAutomation(autoID)
{
    let confirmDelete = confirm("Are you sure you would like to delete this automation?");

    if( confirmDelete )
    {
        $(`#recurring-auto-${autoID}`).modal('hide');
        $(`#recurring-auto-li-${autoID}`).remove();
        deleteAutomation(autoID, "many");

        createPopup('Successfully Deleted Automation!', targetID='popup-container', color='#11F3A9');
    }
}

function validateAutomation( autoID, type )
{
    let autoTypeModifier = "";
    if( type === "many")
    {
        autoTypeModifier = "-many"
    }

    let canSubmit = true;

    let missingInputWarningStr = "The following fields must be filled out: <ul>";

    if( $(`#auto${autoTypeModifier}-name-${autoID}`).val().trim() === "")
    {
        missingInputWarningStr += "<li>Automation Name</li> ";
        canSubmit = false;
    }
    if( $(`#auto${autoTypeModifier}-message-subject-${autoID}`).val().trim() === "" )
    {
        missingInputWarningStr += "<li>Subject</li> ";
        canSubmit = false;
    }
    
    if( $(`#auto${autoTypeModifier}-message-body-${autoID}`).val().trim() === "" )
    {
        missingInputWarningStr += "<li>Message Body</li> ";
        canSubmit = false;
    }

    if( $(`#auto${autoTypeModifier}-sel-msg-type-${autoID}`).val() === "auto-many-def-select-type-opt")
    {
        missingInputWarningStr += "<li>Message Type</li> ";
        canSubmit = false;
    }
  
    if(  $(`#auto${autoTypeModifier}-sel-msg-priority-${autoID}`).val() === "auto-many-def-select-priority-opt" )
    {
        missingInputWarningStr += "<li>Message Priority</li>";
        canSubmit = false;
    }


    if( $(`#auto${autoTypeModifier}-sel-msg-frequency-${autoID}`).val() === "once")
    {
        if( $(`#auto${autoTypeModifier}-send-once-date-${autoID}`).val() === "" )
        {
            missingInputWarningStr += "<li>Date for One Time Automation</li> ";
            canSubmit = false;
        }
    }

    else if( $(`#auto${autoTypeModifier}-sel-msg-frequency-${autoID}`).val() === "many")
    {
        if( $(`#auto${autoTypeModifier}-send-many-date-${autoID}`).val() === "" )
        {
            missingInputWarningStr += "<li>Date for Recurring Automation</li> ";
            canSubmit = false;
        }
    }


    if(canSubmit)
    {
        if( type === "many")
        {
            updateRecurringAutomation( autoID ); // Create the automation using an ajax request.
    
            $(`#recurring-auto-${autoID}`).modal('hide');

            toggleRecurrEditButton( autoID );

            toggleRecurringModalInputs( autoID, true );

    
        }
        else
        {
            updateOneTimeAutomation( autoID );

            $(`#one-time-auto-${autoID}`).modal('hide');

            toggleOneTimeEditButton( autoID ); // Toggle the edit buttons on the modal after finishing edits.

            toggleOneTimeModalInputs( autoID, true );
        }

        createPopup("Successfully Updated Automation!", "popup-container", "#11F3A9", 25);
    }
    else
    {
        missingInputWarningStr += "</ul>"

        if(type === "many")
        {
            createPopup(missingInputWarningStr, `popup-container-recurr-modal-${autoID}`, "#E63131", 18, 0.02);
        }
        else
        {
            createPopup(missingInputWarningStr, `popup-container-onetime-modal-${autoID}`, "#E63131", 18, 0.02);
        }
    }

}


//////////////////////////// END Editing Recurring Automation Code ///////////////////////////////////////

// Type can be either many or one to denote what type of automation to delete.
function deleteAutomation(autoID, type)
{
    $.ajax({
        url:'/user_pages/delete_automation/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        // Pass data to the django function
        data: {autoID: autoID, type: type},

        // Function to call when to django returns a response to our ajax request.
        success: function (data) {
            //var x = JSON.stringify(data);
            console.log("AJAX DELETE AUTOMATION WAS A SUCCESS " + data['Success']);
        },
        // Error handling LOWKEY USELESS
        error: function ( jqXHR, textStatus, errorThrown ) {
            console.log(`Error WITH AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

            console.log('Error - ' + errorMessage);
        }
    });

    
}

function updateOneTimeAutomation( autoID )
{   
    let autoData = {
        auto_id: autoID,
        auto_name: $(`#auto-name-${autoID}`).val(),
        message_subject: $(`#auto-message-subject-${autoID}`).val(),
        message_body: $(`#auto-message-body-${autoID}`).val(),
        message_type: $(`#auto-sel-msg-type-${autoID}`).val(),
        message_priority: $(`#auto-sel-msg-priority-${autoID}`).val()
     }

  
    autoData = Object.assign(
        autoData,
        {message_freq: "once"},
        {send_msg_once_date: $(`#auto-send-once-date-${autoID}`).val() }
        )

    // Change the name of the automation list element to reflect a possibly new name for the auto.
    $(`#one-time-auto-li-${autoID}`).text( autoData.auto_name );

    $.ajax({



        url:'/user_pages/update_automation/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        // Pass data to the django function
        data: autoData,

        // Function to call when to django returns a response to our ajax request.
        success: function (data) {
            //var x = JSON.stringify(data);
            console.log("AJAX UPDATE ONE TIME AUTOMATION WAS A SUCCESS " + data['Success']);
        },
        // Error handling LOWKEY USELESS
        error: function ( jqXHR, textStatus, errorThrown ) {
            console.log(`Error WITH AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

            console.log('Error - ' + errorMessage);
        }
    });
}
        
function updateRecurringAutomation( autoID )
{   
    let autoData = {
        auto_id: autoID,
        auto_name:  $(`#auto-many-name-${autoID}`).val(),
        message_subject: $(`#auto-many-message-subject-${autoID}`).val(),
        message_body: $(`#auto-many-message-body-${autoID}`).val(),
        message_type: $(`#auto-many-sel-msg-type-${autoID}`).val(),
        message_priority: $(`#auto-many-sel-msg-priority-${autoID}`).val()
     }


    autoData = Object.assign(
        autoData,
        {message_freq: "many"},
        {send_msg_many_start_date:  $(`#auto-many-send-many-date-${autoID}`).val() },
        {send_msg_many_freq: 1 },
        {send_msg_many_unit: $(`#auto-many-send-freq-unit-${autoID}`).val() }
    );
       
    // Change the name of the automation list element to reflect a possibly new name for the auto.
    $(`#recurring-auto-li-${autoID}`).text( autoData.auto_name );

    $.ajax({

        url:'/user_pages/update_automation/',
        // Type of Request
        method: "POST",
        // Django requires forms to use a csrf token so we have to pass the token along with our ajax request.
        // Were getting the token from an input created by django by using {% csrf_token %} in our template which generates the input.
        headers:{ 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value},
        // Pass data to the django function
        data: autoData,

        // Function to call when to django returns a response to our ajax request.
        success: function (data) {
            //var x = JSON.stringify(data);
            console.log("AJAX UPDATE MANY AUTOMATION WAS A SUCCESS " + data['Success']);
        },
        // Error handling LOWKEY USELESS
        error: function ( jqXHR, textStatus, errorThrown ) {
            console.log(`Error WITH AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

            console.log('Error - ' + errorMessage);
        }
    });
}