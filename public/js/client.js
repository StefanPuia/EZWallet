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

function drawDashChart(inputData){
    let data = google.visualization.arrayToDataTable(inputData);

    let options = {
              title: 'Monthly Spending'
            };

    let chart = new google.visualization.PieChart(document.getElementById('expenses-chart'));
    chart.draw(data, options);
}


// this function is used to add a new list item to the list of transactions on the Dashboard
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
    category.innerText= transaction.Category;
    anchor.appendChild(category);

    let details = document.createElement("p");
    details.innerHTML = transaction.Description;
    details.appendChild(document.createElement("br"));
    anchor.appendChild(details);

    let date = document.createElement("small");
    date.innerText = transaction.Date.substring(0, 10);
    details.appendChild(date);

    let amount = document.createElement("span");
    amount.classList.add("secondary-content","red-text","text-accent-3");
    amount.innerText = "£" + transaction.Amount;
    details.appendChild(amount);

    let list = document.getElementById("recordList");

    let bottom = document.getElementById("listBottom");
    list.insertBefore(record,list.childNodes[0]);
}
