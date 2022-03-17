
window.addEventListener('load', (event) => {

    // Assigns click listeners to the buttons and select elements inside the modal 
    initializeAutomationModal();

    initializeOneTimeAutoModals();
    initializeRecurringAutoModals();

    $('#auto-sel-msg-type').change();
})


function initializeAutomationModal()
{

    $('.one-time-auto-modal').each(function(){
        let oneTimeAutoID = $(this).data('autoId');
        console.log(`MODAL ID IS ${oneTimeAutoID}`);

        $('#auto-sel-msg-frequency-' + oneTimeAutoID).on('change', ()=> toggleAutomationTypeOneTime( oneTimeAutoID ) );


    });

    $('.recurring-auto-modal').each(function(){
        let recurringAutoID = $(this).data('autoId');

        console.log(`MODAL ID IS ${recurringAutoID}`);

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




function updateAutomation()
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

function initializeOneTimeAutoModals()
{
   $('.one-time-auto-modal').each( function(){

    let oneTimeAutoID = $(this).data('autoId');

    $('#auto-sel-msg-frequency-' + oneTimeAutoID).val('once').change();
    $('#auto-sel-msg-type-' + oneTimeAutoID).val($('#auto-sel-msg-type-val-' + oneTimeAutoID).val()).change();
    $('#auto-sel-msg-priority-' + oneTimeAutoID).val( $('#auto-sel-msg-priority-val-' + oneTimeAutoID).val() ).change();
    $('#auto-send-once-date-' + oneTimeAutoID).val( $('#auto-send-once-date-val-' + oneTimeAutoID).val() ).change();

   })

  
}

function initializeRecurringAutoModals()
{
    $('.recurring-auto-modal').each( function(){

        let recurringAutoID = $(this).data('autoId');

        console.log(`AUTO ID: ${recurringAutoID}`);

        $('#auto-many-sel-msg-frequency-' + recurringAutoID).val('many').change();
        $('#auto-many-sel-msg-type-' + recurringAutoID).val($('#auto-many-sel-msg-type-val-' + recurringAutoID).val()).change();
        $('#auto-many-sel-msg-priority-' + recurringAutoID).val( $('#auto-many-sel-msg-priority-val-' + recurringAutoID).val() ).change();
        $('#auto-many-send-many-date-' + recurringAutoID).val( $('#auto-many-send-many-date-val-' + recurringAutoID).val() ).change();
        $('#auto-many-send-freq-unit-' + recurringAutoID).val( $('#auto-many-send-freq-unit-val-' + recurringAutoID).val() ).change();

    })


}