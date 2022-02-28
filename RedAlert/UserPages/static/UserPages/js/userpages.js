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

        $('#allow-pass-edit').prop("checked", false);

        $('#update-pass-input-1').val("");
        $('#update-pass-input-2').val("");
        $('#update-pass-input-1').prop('disabled', true);
        $('#update-pass-input-2').prop('disabled', true);
        $('#user-changed-password').val('false');

    })

    $('#allow-pass-edit').on('click',function(){
        
        if( $(this).is(":checked") )
        {
            $('#update-pass-input-1').prop('disabled', false);
            $('#update-pass-input-2').prop('disabled', false);
            $('#user-changed-password').val('true');
        }
        else
        {
            $('#update-pass-input-1').prop('disabled', true);
            $('#update-pass-input-2').prop('disabled', true);
            $('#user-changed-password').val('false');
        }
    });
});


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