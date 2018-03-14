window.addEventListener('load', async function() {

    // initialize materialize components
    $(".button-collapse").sideNav();
    $('select').material_select();

    // add click events for log in-out buttons
    $('#nav-log').on('click', signOut);
    $('#nav-log-mobile').on('click', signOut);

    // send the user to /login if not logged in
    gapi.auth2.getAuthInstance().then(function(e) {
        let logged = e.isSignedIn.get();
        if (location.pathname != "/login" && logged === false) {
            signOut();
        }
    })
})