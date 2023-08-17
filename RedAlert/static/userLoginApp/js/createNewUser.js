window.addEventListener('load', (event) => {

    insertPasswordValidationHTML();

    resetPassFieldsOnLoad();

    $('#id_agent_code').on('keyup', checkNewAccountInput );
    $('#id_agent_phone_number').on('keyup', checkNewAccountInput );


    // Give both pass fields listeners to detect changes in the input. Notice the first two params are switched in validatePassword. This is because validatePassword checks input1 against password validators but only checks input2
    // when validating the form for submission, therefore we need to also add a listeners to the other input to check input2 against input1 while the user types.
    $('#id_password').keyup(function(){
        // Set validate password listener 
        let correctValidation = validatePassword('#id_password', '#id_password_confirm', '#pass-validation-alert-list');

        if( correctValidation )
        {
            $('#create-new-account-btn').prop('disabled', false);
        }
        else
        {
            $('#create-new-account-btn').prop('disabled', true);
        }
    });

    $('#id_password_confirm').keyup(function(){

        // Set validate password listener 
        let correctValidation = validatePasswordMatchOnly('#id_password_confirm', '#id_password', '#pass-validation-alert-list');

        if( correctValidation )
        {
            $('#create-new-account-btn').prop('disabled', false);
        }
        else
        {
            $('#create-new-account-btn').prop('disabled', true);
        }
    });
});



function checkNewAccountInput()
{

    let regExp = new RegExp("^\\d+$");
    let agentCodeValid = regExp.exec($('#id_agent_code').val());
    let agentPhoneNumValid = regExp.exec($('#id_agent_phone_number').val());

    let inputsValid = agentCodeValid && agentPhoneNumValid;

    if( !inputsValid )
    {
        console.log(`Disabling submit button.`);
        $('#create-new-account-btn').attr('disabled', true);
    }
    else
    {
        console.log(`Enabling submit button.`);
        $('#create-new-account-btn').attr('disabled', false);
    }

    
    
    $('.agent-code-number-req-warning').remove();

    if( !agentCodeValid )
    {
        console.log(`Adding warning for: code`)
        $("label[for='id_agent_code']").append(`<span class='agent-code-number-req-warning red-text'> *Please Enter a Number</span>`);
    }


    $('.agent-phone-number-req-warning').remove();

    if( !agentPhoneNumValid )
    {
        console.log(`Adding warning for: phone`)
        $("label[for='id_agent_phone_number']").append(`<span class='agent-phone-number-req-warning red-text'> *Please Enter a Number</span>`);
    }
}








// Validates the first input field only checking if password meets the requirements.
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

    $('#id_password').val("");
    $('#id_password_confirm').val("");
}



// Manually inserts the html that tells user what pass requirements they need.
// This is a workaround since we are using django forms and cannot directly place this code inside our html where we need it to go so we must use jquery. Screw Django Forms!
function insertPasswordValidationHTML()
{
    $(`<ul id="pass-validation-alert-list" class="fa-ul">
        <li id='needs-upper-case-fail' class="display-none"><span class='fa-li'> <i class='fa-solid fa-xmark red-text-color'></i> </span> <span class='red-text-color'>Password must contain 1 upper case letter. </span></li>
        <li id='needs-upper-case-succeed' class="display-none"><span class='fa-li'> <i class='fa-solid fa-check green-text-color'></i> </span> <span class='green-text-color'>Password must contain 1 upper case letter. </span></li>

        <li id='needs-lower-case-fail' class="display-none"><span class='fa-li'> <i class='fa-solid fa-xmark red-text-color'></i> </span > <span class='red-text-color'>Password must contain 1 lower case letter.</span></li>
        <li id='needs-lower-case-succeed' class="display-none"><span class='fa-li'> <i class='fa-solid fa-check green-text-color'></i> </span> <span class='green-text-color'>Password must contain 1 lower case letter.</span></li>

        <li id='needs-digit-fail' class="display-none"><span class='fa-li'> <i class='fa-solid fa-xmark red-text-color'></i> </span> <span class='red-text-color'>Password must contain 1 digit.</span></li>
        <li id='needs-digit-succeed' class="display-none"><span class='fa-li'> <i class='fa-solid fa-check green-text-color'></i> </span> <span class='green-text-color'>Password must contain 1 digit.</span></li>

        <li id='needs-special-char-fail' class="display-none"><span class='fa-li'> <i class='fa-solid fa-xmark red-text-color'></i> </span > <span class='red-text-color'>Password must contain 1 special character.</span></li>
        <li id='needs-special-char-succeed' class="display-none"><span class='fa-li'> <i class='fa-solid fa-check green-text-color'></i> </span> <span class='green-text-color'>Password must contain 1 special character</span></li>

        <li id='needs-length-fail' class="display-none"><span class='fa-li'> <i class='fa-solid fa-xmark red-text-color'></i> </span> <span class='red-text-color'>Password must be at least 8 characters long.</span></li>
        <li id='needs-length-succeed' class="display-none"><span class='fa-li'> <i class='fa-solid fa-check green-text-color'></i> </span> <span class='green-text-color'>Password must be at least 8 characters long.</span></li>

        <li id='needs-to-match' class="display-none"><span class='fa-li'> <i class='fa-solid fa-xmark red-text-color'></i> </span> <span class='red-text-color'>Passwords must match before you can submit! </span></li>
        <li id='pass-match' class="display-none"> <span class='fa-li'> <i class='fa-solid fa-check green-text-color'></i> </span> <span class='green-text-color'> Passwords match! You may submit now! </span> </li>
        
      </ul>`
    ).insertAfter( $('#id_password_confirm') );
}


