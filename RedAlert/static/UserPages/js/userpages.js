window.addEventListener('load', (event) => {

    resetPassFieldsOnLoad();

    $('#edit-user-profile').on('click', function()
    {
        $('#user-profile-display-form').toggle();
        $('#user-profile-edit-form').toggle();

        $('#allow-pass-edit').prop("checked", false);
    })

    $('#discard-user-profile-changes').on('click', function()
    {
        $('#user-profile-display-form').toggle();
        $('#user-profile-edit-form').toggle();

        // If user discards changes, uncheck the checkbox as it is not reset automatically.
        $('#allow-pass-edit').prop("checked", false);

        togglePasswordEdit();

    })

    $('#allow-pass-edit').on('click',function(){
        
        togglePasswordEdit();
    });


    // Give both pass fields listeners to detect changes in the input. Notice the first two params are switched in validatePassword. This is because validatePassword checks input1 against password validators but only checks input2
    // when validating the form for submission, therefore we need to also add a listeners to the other input to check input2 against input1 while the user types.
    $('#update-pass-input-1').keyup(function(){
        // Set validate password listener 
        let correctValidation = validatePassword('#update-pass-input-1', '#update-pass-input-2', '#pass-validation-alert-list');

        if( correctValidation )
        {
            $('#submit-user-profile-changes').prop('disabled', false);
        }
        else
        {
            $('#submit-user-profile-changes').prop('disabled', true);
        }
    });

    $('#update-pass-input-2').keyup(function(){

        // Set validate password listener 
        let correctValidation = validatePasswordMatchOnly('#update-pass-input-2', '#update-pass-input-1', '#pass-validation-alert-list');

        if( correctValidation )
        {
            $('#submit-user-profile-changes').prop('disabled', false);
        }
        else
        {
            $('#submit-user-profile-changes').prop('disabled', true);
        }
    });
});


function validatePassword( input1ID, input2ID, passValidStatusListID)
{
    $(passValidStatusListID).show();
    var validateEntire = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*_-]).{8,}$');
    var validateUpperCase = new RegExp('(?=.*?[A-Z])');
    var validateLowerCase = new RegExp('(?=.*?[a-z])');
    var validateOneDigit = new RegExp('(?=.*?[0-9])');
    var validateSpecialChar = new RegExp('(?=.*?[#?!@$ %^&*_-])');
    var validateLength = new RegExp('.{8,}');

    console.log("In validation function!");

    console.log("Main validation failed.!");

    if( !validateUpperCase.test( $(input1ID).val() ) )
    {
        $('#needs-upper-case-succeed').hide();
        $('#needs-upper-case-fail').show();
    }
    else
    {
        $('#needs-upper-case-fail').hide();
        $('#needs-upper-case-succeed').show();
    }

    if( !validateLowerCase.test( $(input1ID).val() ) )
    {
        $('#needs-lower-case-succeed').hide();
        $('#needs-lower-case-fail').show();
        
    }
    else
    {
        $('#needs-lower-case-fail').hide();
        $('#needs-lower-case-succeed').show();
    }
    

    if( !validateOneDigit.test( $(input1ID).val() ) )
    {
        $('#needs-digit-succeed').hide();
        $('#needs-digit-fail').show();
        
    }
    else
    {
        $('#needs-digit-fail').hide();
        $('#needs-digit-succeed').show();
        
    }
    

    if( !validateSpecialChar.test( $(input1ID).val() ) )
    {
        $('#needs-special-char-succeed').hide();
        $('#needs-special-char-fail').show();
        
    }
    else
    {
        $('#needs-special-char-fail').hide();
        $('#needs-special-char-succeed').show();
    }
    
    if(!validateLength.test( $(input1ID).val() ) )
    {
        $('#needs-length-succeed').hide();
        $('#needs-length-fail').show();
        
    }
    else
    {
        $('#needs-length-fail').hide();
        $('#needs-length-succeed').show();
    }

    // See if they match
    if( $(input1ID).val() != $(input2ID).val() )
    {
        $('#pass-match').hide();
        $('#needs-to-match').show();


    }
    else if( $(input1ID).val() === $(input2ID).val()  )
    {   
        // If input1 and input2 are the same string and one of them validates that means both should validate.
        if( $(input1ID).val() != "" && $(input2ID).val() != "" && ( validateEntire.test( $(input1ID).val() ) ) )
        {
            $('#needs-to-match').hide();
            $('#pass-match').show();
            return true;
        }

    }

    return false;
}

// Validates the second input field, checking if both password inputs match each other.
function validatePasswordMatchOnly(  input1ID, input2ID, passValidStatusListID )
{
    var validateEntire = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*_-]).{8,}$');

    //console.log(`INPUT 1: ${$(input1ID).val()} INPUT 2: ${$(input2ID).val()}`);
    // If they dont match return false
    if( $(input1ID).val() != $(input2ID).val() )
    {   
        $('#pass-match').hide();
        
        $('#needs-to-match').show();

        return false;
    }
    else if( $(input1ID).val() === $(input2ID).val()  )
    {   
        // If input1 and input2 are the same string and one of them validates that means both should validate.
        if( $(input1ID).val() != "" && $(input2ID).val() != "" && ( validateEntire.test( $(input1ID).val() ) ) )
        {
            $('#needs-to-match').hide();
            $('#pass-match').show();
            return true;
        }

    }
}

// This enables password editing inputs or disabled them based on user clicking a check box.
function togglePasswordEdit()
{
    if( $('#allow-pass-edit').is(":checked") )
    {
        // enable the password field inputs.
        $('#update-pass-input-1').prop('disabled', false);
        $('#update-pass-input-2').prop('disabled', false);

        // Used to signify the user changed their password when we parse the form in django.
        $('#user-changed-password').val('true');
        // Show the password validation list when user begins enables password editing.
        $('#pass-validation-alert-list').show();

        // Disable submit button when user enables password editing
        $('#submit-user-profile-changes').prop('disabled', true);
    }
    else
    {
        // If the use disables password editing, disable the password input.
        $('#update-pass-input-1').prop('disabled', true);
        $('#update-pass-input-2').prop('disabled', true);

        // Clear the password inputs.
        $('#update-pass-input-1').val("");
        $('#update-pass-input-2').val("");

        // set this form input as false to indicate the user chose to NOT change their password.
        $('#user-changed-password').val('false');

        // Clear the pass validation list and hide it when user hits the check box to disable password editing.
        $('#pass-validation-alert-list').hide();

        // Enable submit button when user disables password editing
        $('#submit-user-profile-changes').prop('disabled', false);
    }
}

// Removes input from password fields and ensures checkbox is not checked on page refresh since browsers like Firefox love to fill in forms for you.
function resetPassFieldsOnLoad()
{
    $('#allow-pass-edit').prop("checked", false);
    $('#update-pass-input-1').prop('disabled', true);
    $('#update-pass-input-2').prop('disabled', true);

    $('#update-pass-input-1').val("");
    $('#update-pass-input-2').val("");
}




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

        $('#auto-sel-msg-frequency-' + oneTimeAutoID).on('change', ()=> toggleAutomationTypeOneTime( oneTimeAutoID ) )


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
        $('#auto-many-send-msg-many-inputs-' + autoID).removeClass('display-none');
        $('#auto-many-send-msg-once-inputs-' + autoID).addClass('display-none');
    }
    else
    {
        $('#auto-many-send-msg-once-inputs-' + autoID).addClass('display-none');
        $('#auto-many-send-msg-many-inputs-' + autoID).addClass('display-none');
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
        $('#auto-many-sel-msg-type-' + recurringAutoID).val($('#auto-sel-msg-type-val-' + recurringAutoID).val()).change();
        $('#auto-many-sel-msg-priority-' + recurringAutoID).val( $('#auto-sel-msg-priority-val-' + recurringAutoID).val() ).change();
        $('#auto-many-send-many-date-' + recurringAutoID).val( $('#auto-many-send-many-date-val-' + recurringAutoID).val() ).change();
        $('#auto-many-send-freq-unit-' + recurringAutoID).val( $('#auto-many-send-freq-unit-val-' + recurringAutoID).val() ).change();

    })


}