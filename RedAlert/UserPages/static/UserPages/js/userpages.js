window.addEventListener('load', (event) => {

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

    $('#update-pass-input-1').keyup(function(){
        validatePassword('#update-pass-input-1', '#update-pass-input-2');

    });
});


function validatePassword( input1ID, input2ID)
{
    var validateEntire = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$');
    var validateUpperCase = new RegExp('(?=.*?[A-Z])');
    var validateLowerCase = new RegExp('(?=.*?[a-z])');
    var validateOneDigit = new RegExp('(?=.*?[0-9])');
    var validateSpecialChar = new RegExp('(?=.*?[#?!@$ %^&*-])');
    var validateLength = new RegExp('.{8,}');

    console.log("In validation function!");

    // If password 1 does not meet security criteria, tell user why.
    if( !( validateEntire.test( $(input1ID).val() ) ) )
    {
        
        console.log("Main validation failed.!");

        if( !validateUpperCase.test( $(input1ID).val() ) )
        {
            console.log("Needs uppercase.!");
            
            $('#pass-validation-alert-list').append("<li id='needs-upper-case'>Password must contain 1 upper case letter.</li>");
        }
        else
        {
            $('#needs-upper-case').remove();
        }

        if(!validateLowerCase.test( $(input1ID).val() ) )
        {
            $('#pass-validation-alert-list').append("<li id='needs-lower-case'>Password must contain 1 lower case letter.</li>");
        }
        else
        {
            $('#needs-lower-case').remove();
        }
        

        if(!validateOneDigit.test( $(input1ID).val() ) )
        {
            $('#pass-validation-alert-list').append("<li id='needs-digit'>Password must contain 1 digit.</li>");
        }
        else
        {
            $('#needs-digit').remove();
        }
        

        if(!validateSpecialChar.test( $(input1ID).val() ) )
        {
            $('#pass-validation-alert-list').append("<li id='needs-special-char'>Password must contain 1 special character</li>");
        }
        else
        {
            $('#needs-special-char').remove();
        }
        
        if(!validateLength.test( $(input1ID).val() ) )
        {
            $('#pass-validation-alert-list').append("<li id='needs-length'>Password must be at least 8 characters long.</li>");
        }
        else
        {
            $('#needs-length').remove();
        }

    }
    // If passwords meet criteria, see if they match
    else if( $(input1ID).val() != $(input2ID).val() )
    {
        // Clear the list of validation requirements for now.
        // Soon we will not remove, but instead change the class of the list element
        $('#pass-validation-alert-list').html("");

        console.log("Passwords must match!");

        $('#pass-validation-alert-list').append("<li>Passwords must match before you can submit!</li>");
    }
    else if( $(input1ID).val() === $(input2ID).val()  )
    {
        console.log("Passwords match!");
        $('#pass-validation-alert-list').html("");
        $('#pass-validation-alert-list').append("<li>Passwords match and validate!</li>");
    }
}

function togglePasswordEdit()
{
    if( $('#allow-pass-edit').is(":checked") )
    {
        $('#update-pass-input-1').prop('disabled', false);
        $('#update-pass-input-2').prop('disabled', false);
        $('#user-changed-password').val('true');
    }
    else
    {
        $('#update-pass-input-1').prop('disabled', true);
        $('#update-pass-input-2').prop('disabled', true);

        $('#update-pass-input-1').val("");
        $('#update-pass-input-2').val("");

        $('#user-changed-password').val('false');
    }
}