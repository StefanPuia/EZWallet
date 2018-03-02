window.addEventListener('load', async function() {
    $(".button-collapse").sideNav();

	$('#nav-log').on('click', signOut);
	$('#nav-log-mobile').on('click', signOut);

    if (location.pathname != "/login" && await !gapi.auth2.getAuthInstance().isSignedIn.get()) {
        signOut();
    }

    calcBudget();
})