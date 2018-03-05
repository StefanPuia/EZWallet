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
    gapi.auth2.getAuthInstance().then(function(e) {
        let logged = e.isSignedIn.get();
        if (location.pathname != "/login" && logged === false) {
            signOut();
        }
    })
    fillDash();
})


// this function is sed to ad a new list item to the list of transactions on the Dashboard
function newRecEl(transaction){
    let record = document.createElement("li");
    record.classList.add("collection-item","avatar");

    let anchor = document.createElement("a");
    anchor.setAttribute("href","");
    anchor.classList.add("black-text");
    record.appendChild(anchor);

    let icon = document.createElement("i");
    icon.classList.add("material-icons","circle","red","lighten-1");
    icon.innerText = "restaurant";
    anchor.appendChild(icon);

    let category = document.createElement("b");
    category.classList.add("title");
    category.innerText= "test";
    anchor.appendChild(category);

    let details = document.createElement("p");
    details.innerHTML = transaction.description;
    details.appendChild(document.createElement("br"));
    anchor.appendChild(details);

    let date = document.createElement("small");
    date.innerText = transaction.tdate.substring(0, 10);
    details.appendChild(date);

    let amount = document.createElement("span");
    amount.classList.add("secondary-content","red-text","text-accent-3");
    amount.innerText = "£" + transaction.amount;
    details.appendChild(amount);

    let list = document.getElementById("recordList");

    let bottom = document.getElementById("listBottom");
    list.insertBefore(record,list.childNodes[0]);
}
