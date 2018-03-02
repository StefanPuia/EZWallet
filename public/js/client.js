window.onload = function() {


}
function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();

    signIn();
	fillPage();
}

function fillPage(){
	calcBudget();
}
