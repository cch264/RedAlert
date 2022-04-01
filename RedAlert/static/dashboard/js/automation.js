window.addEventListener('load', (event) => {

    initializeAutomationModal();
})


function initializeAutomationModal()
{
    $('#auto-sel-msg-frequency').on('change', toggleAutomationType )

    $('#auto-modal-cancel').on('click', clearModalInputs )

    $('#auto-send-msg').on('click', createAutomation);
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


function clearModalInputs()
{
    $('#auto-sel-msg-frequency').val('auto-def-select-opt').change();
    $('#auto-send-once-date').val('');
    $('#auto-send-many-date').val('').change();
    $('#auto-send-freq').val('');
    $('#auto-send-freq-unit').val('auto-send-each-day').change();

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