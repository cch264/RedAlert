window.addEventListener('load', (event) => {

    initializeAutomationModal();
})


function initializeAutomationModal()
{
    $('#auto-sel-msg-frequency').on('change', toggleAutomationType )

    $('#auto-modal-cancel').on('click', clearModalInputs )

    $('#auto-send-msg').on('click', validateAutomation);
}



function toggleAutomationType()
{
    if( $('#auto-sel-msg-frequency').val() === "once" )
    {
        $('#auto-send-msg-once-inputs').removeClass('display-none');
        $('#auto-send-msg-many-inputs').addClass('display-none');
    }
    else if( $('#auto-sel-msg-frequency').val() === "many" )
    {
        $('#auto-send-msg-many-inputs').removeClass('display-none');
        $('#auto-send-msg-once-inputs').addClass('display-none');
    }
    else
    {
        $('#auto-send-msg-once-inputs').addClass('display-none');
        $('#auto-send-msg-many-inputs').addClass('display-none');
    }
}

// Clear all input elements inside the modal if the user hits the discard button.
function clearModalInputs()
{

    $('#auto-name').val('');
    $('#auto-message-subject').val('');
    $('#auto-message-body').val('');
    $('#auto-sel-msg-type').val('auto-def-select-type-opt').change();
    $('#auto-sel-msg-priority').val('auto-def-select-priority-opt').change();

    $('#auto-sel-msg-frequency').val('auto-def-select-freq-opt').change();
    $('#auto-send-once-date').val('').change();;
    $('#auto-send-many-date').val('').change();
    $('#auto-send-freq').val('1');
    $('#auto-send-freq-unit').val('day').change();

}

function validateAutomation()
{

    let canSubmit = true;

    let missingInputWarningStr = "The following fields must be filled out: <ul>";

    if( $('#auto-name').val().trim() === "")
    {
        missingInputWarningStr += "<li>Automation Name</li> ";
        canSubmit = false;
    }
    if( $('#auto-message-subject').val().trim() === "" )
    {
        missingInputWarningStr += "<li>Subject</li> ";
        canSubmit = false;
    }
    
    if( $('#auto-message-body').val().trim() === "" )
    {
        missingInputWarningStr += "<li>Message Body</li> ";
        canSubmit = false;
    }

    if( $('#auto-sel-msg-type').val() === "auto-def-select-type-opt")
    {
        missingInputWarningStr += "<li>Message Type</li> ";
        canSubmit = false;
    }
  
    if(  $('#auto-sel-msg-priority').val() === "auto-def-select-priority-opt" )
    {
        missingInputWarningStr += "<li>Message Priority</li>";
        canSubmit = false;
    }



    if( $('#auto-sel-msg-frequency').val() === "auto-def-select-freq-opt")
    {
        missingInputWarningStr += "<li>Automation Type</li> ";
        canSubmit = false;
    }
    else if( $('#auto-sel-msg-frequency').val() === "once")
    {
        if( $(`#auto-send-once-date`).val() === "" )
        {
            missingInputWarningStr += "<li>Date for One Time Automation</li> ";
            canSubmit = false;
        }
    }
    else if( $('#auto-sel-msg-frequency').val() === "many")
    {
        if( $(`#auto-send-many-date`).val() === "" )
        {
            missingInputWarningStr += "<li>Date for Recurring Automation</li> ";
            canSubmit = false;
        }
    }

    if($(`#selected-clients-id-array`).val() === "" )
    {
        missingInputWarningStr += "<li>You Must Select at Least 1 Client Before Creating an Automation</li> ";
        canSubmit = false;
    }


    if(canSubmit)
    {
        createAutomation(); // Create the automation using an ajax request.
        clearModalInputs(); // Clear automation inputs if the auto was succesfull.
        $(`#create-automation-modal`).modal('hide');

        createPopup("Successfully Created Automation!", "popup-container-auto-create-success", "#11F3A9", 25);
    }
    else
    {
        missingInputWarningStr += "</ul>"
        createPopup(missingInputWarningStr, "popup-container-auto-modal", "#E63131", 18, 0.02);
    }

}


function createAutomation()
{   
    let autoData = {
        auto_name: $('#auto-name').val(),
        message_subject: $('#auto-message-subject').val(),
        message_body: $('#auto-message-body').val(),
        message_type: $('#auto-sel-msg-type').val(),
        message_priority: $('#auto-sel-msg-priority').val(),
        selected_clients: $('#selected-clients-id-array').val(),

     }

    let msg_freq = $('#auto-sel-msg-frequency').val();

    if( msg_freq === 'once' )
    {
        autoData = Object.assign(
            autoData,
            {message_freq: msg_freq},
            {send_msg_once_date: $('#auto-send-once-date').val()}
         )
    }
    else
    {
        autoData = Object.assign(
            autoData,
            {message_freq: msg_freq},
            {send_msg_many_start_date: $('#auto-send-many-date').val() },
            {send_msg_many_freq: 1 },
            {send_msg_many_unit: $('#auto-send-freq-unit').val() }
        );
       
    }

    $.ajax({



        url:'/dashboard/save_automation/',
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
            console.log("AJAX AUTOMATION WAS A SUCCESS " + data['Success']);
        },
        // Error handling LOWKEY USELESS
        error: function ( jqXHR, textStatus, errorThrown ) {
            console.log(`Error WITH AJAX RESP ${ errorThrown } ${textStatus} ${jqXHR.responseXML}`);
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText

            console.log('Error - ' + errorMessage);
        }
    });
}