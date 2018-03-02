window.addEventListener('load', async function() {

    // initialize materialize components
    $(".button-collapse").sideNav();
    $('select').material_select();
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false // Close upon selecting a date,
    });
    $('.timepicker').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0, // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Clear', // text for clear-button
        canceltext: 'Cancel', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function() {} //Function for after opening timepicker
    });

    // add click events for log in-out buttons
    $('#nav-log').on('click', signOut);
    $('#nav-log-mobile').on('click', signOut);

    // send the user to /login if not logged in
    if (location.pathname != "/login" && await !gapi.auth2.getAuthInstance().isSignedIn.get()) {
        signOut();
    }

    calcBudget();
})