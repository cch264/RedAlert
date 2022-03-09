window.addEventListener('load', (event) => {

    $('#edit-user-profile').on('click', function()
    {
        $('#user-profile-display-form').toggle();
        $('#user-profile-edit-form').toggle();
    })

    $('#discard-user-profile-changes').on('click', function()
    {
        $('#user-profile-display-form').toggle();
        $('#user-profile-edit-form').toggle();
    })
});