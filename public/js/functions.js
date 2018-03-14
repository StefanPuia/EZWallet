'use strict';

let verbose = true;

/**
 * Creates a new [tag] element and assigns the provided attributes to it
 * @param  {String} tag name
 * @param  {Object} attributes object to be applied
 * @return {NodeElement} the new element
 */
function newEl(tag, attr = {}) {
    let el = document.createElement(tag);
    Object.assign(el, attr);
    Object.assign(el.style, attr.style);
    return el;
}

/**
 * get the value of a url query parameter
 * @param {String} field parameter name
 * @param {String} url optional url to be used
 * @return {String} parameter value
 */
function getQueryString(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};

/**
 * Get the parameter value from an url string
 * @param  {Location} location object
 * @param  {String} parameter to search for
 * @return {String} parameter value or undefined if not found
 */
function getParameterValue(param, path) {
    path = !!path?path:location.pathname;
    let parts = escape(path).split('/');
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] == param && parts.length > i) {
            return parts[i + 1];
        }
    }
    return undefined;
}

/**
 * transform a json object into a query string
 * @param {Object} json the json object
 * @return {String} the query string
 */
function jsonToQueryString(json) {
    return '?' +
        Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

/**
 * make a call to the api server
 * @param {String} fetchURL url to use the call on
 * @param {Function} callback
 * @param {Object} options fetch options object
 */
async function callServer(fetchURL, options, callback) {
    options = (typeof options === 'undefined') ? {} : options;
    callback = (typeof callback === 'undefined') ? () => {} : callback;

    gapi.auth2.getAuthInstance().then(async function(ai) {
        let token = ai.currentUser.get().getAuthResponse().id_token;

        const fetchOptions = {
            credentials: 'same-origin',
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        };



        Object.assign(fetchOptions, options);

        // log the request
        if (verbose) console.log(`Requested: ${fetchOptions.method.toUpperCase()} ${fetchURL}`);

        const response = await fetch(fetchURL, fetchOptions);
        if (!response.ok) {
            // handle the error
            console.log("Server error:\n" + response.status);
            return;
        }

        // handle the response
        let data = await response.text();
        if (!data) {
            data = JSON.stringify({
                error: "error on fetch"
            });
        }

        try {
            data = JSON.parse(data);
        } catch (err) {
            data = {
                response: data
            };
        }

        // log the results
        if (verbose) console.log("Recieved: ", data);

        callback(data);
    })
}

/**
 * sign the user in
 */
function signIn() {
    $('#nav-log').text("Log Out");
    $('#nav-log-mobile').text("Log Out");
    $('.hide-on-signout').each(function(key, el) {
        el.style.display = 'block';
    })
    callServer('/api/user', {}, function(data) {
        // console.log(data);
    });
}

/**
 * sign the user out
 */
async function signOut() {
    if (await gapi.auth2.getAuthInstance().isSignedIn.get()) {
        await gapi.auth2.getAuthInstance().signOut();
    }
    window.location = "/login";
}

/**
 * redirects the user when the login at /login succeeds
 */
function mainSignIn() {
    callServer('/api/user', {}, function(data) {
        if(data.response == 'Created') {
            localStorage.isNewAccount = 'true';
            window.location = '/settings';
        }
        else {
            window.location = "/";
        }
    });
    
}

/**
 * get the user's details
 * @param {Object} apiOptions fields to be fetched
 */
function getDetails(apiOptions = {}, callback) {
    let fetchURL = 'api/user/' + jsonToQueryString(apiOptions);
    callServer(fetchURL, {}, function(data) {
        callback(data);
    });
}

/**
 * get the user's budget
 */
function getBudget(callback) {
    callServer('/api/budget/', {}, function(data) {
        callback(data);
    });
}

/**
 * set the user's budget
 * @param {Float} budget budget to be set
 * @param {Function} callback
 */
function setBudget(budget, callback) {
    let payload = {
        budget: budget
    };

    callServer('/api/budget/', {
        method: 'post',
        body: JSON.stringify(payload)
    }, function(data) {
        callback(data);
    });
}

/**
 * add a transaction
 * @param {Object} payload transaction data
 */
function addTransaction(payload) {
    callServer('/api/transaction/', {
        method: 'post',
        body: JSON.stringify(payload)
    }, function(data) {
        callback(data);
    });
}

/**
 * delete transaction by id
 * @param {Int} id transaction id
 * @param {Function} callback
 */
function deleteTransaction(id, callback) {
    let fetchURL = 'api/transaction/' + id;
    callServer(fetchURL, {
        method: 'delete'
    }, function(data) {
        callback(data);
    });
}

/**
 * get all transactions
 * @param {Object} params filter parameters
 * @param {Function} callback
 */
function getTransactions(params, callback) {
    let fetchURL = 'api/transaction' + jsonToQueryString(params);
    callServer(fetchURL, {}, function(data) {
        callback(data);
    });
}

/**
 * get a transaction by id
 * @param {Int} id transaction id
 * @param {Function} callback
 */
function getTransaction(id, callback) {
    let fetchURL = 'api/transaction/' + id;
    callServer(fetchURL, {}, function(data) {
        callback(data);
    });
}

/**
 * create a new transaction element
 * @param  {Object} transaction
 * @return {Node}
 */
function newRecEl(transaction) {
    let record = newEl('li', {
        classList: 'collection-item avatar'
    });

    let anchor = newEl('a', {
        href: '/edit/' + transaction.id,
        classList: 'black-text'
    });
    record.append(anchor);

    let icon = newEl('i', {
        classList: `material-icons circle ${transaction.colour} lighten-1`,
        textContent: transaction.icon
    });
    anchor.appendChild(icon);

    let category = newEl('b', {
        classList: 'title',
        textContent: transaction.category
    });
    anchor.appendChild(category);

    let details = newEl('p', {
        textContent: transaction.description
    });
    anchor.appendChild(details);

    let date = newEl('small', {
        textContent: pullDate(transaction.date) + ' ' + pullTime(transaction.date),
    });
    anchor.appendChild(date);

    let transactionAmount = transaction.amount > 0 ? '£' + transaction.amount : '-£' + transaction.amount * -1;
    let transactionTextColour = transaction.amount > 0 ? 'green-text' : 'red-text';
    let amount = newEl('span', {
        classList: 'secondary-content text-accent-3 ' + transactionTextColour,
        textContent: transactionAmount
    });
    details.appendChild(amount);

    return record;
}

/**
 * calculate a month's budget
 * the current month will be used if none is provided
 * @param  {Int} month
 * @param  {Int} year
 * @return {Int} budget left
 */
function calcBudget(month, year, callback) {
    let date = {
        month: month ? month : new Date().getMonth() + 1,
        year: year ? year : new Date().getFullYear()
    };

    getBudget(function(budget) {
        getTransactions(date, function(transactions) {
            transactions.forEach(function(transaction) {
                budget += transaction.amount;
            })
            callback(budget);
        });
    })
}

/**
 * draw a chart
 * @param  {Object} inputData
 * @param {String} title
 * @param  {Node} container
 */
function drawChart(inputData, title, container) {
    let data = google.visualization.arrayToDataTable(inputData);

    let options = {
        title: title,
        width: '100%',
        height: 450
    };

    let chart = new google.visualization.PieChart(container);
    chart.draw(data, options);
}

/**
 * parsing transactions data to be used in the google chart api
 * @param  {Int} budget
 * @param  {Array} transactions
 * @return {Array} parsed array
 */
function calcTotals(budget, transactions) {
    let totals = {
        Remaining: budget > 0 ? budget : 0
    }

    let chartData = [
        ["Categories", "Budget Spent"]
    ];

    for (let i in transactions) {
        if(!totals[transactions[i].category]) {
            totals[transactions[i].category] = 0;
        }

        totals[transactions[i].category] -= transactions[i].amount;
        if(totals[transactions[i].category] < 0) {
            totals[transactions[i].category] *= -1;
        }
    }

    Object.keys(totals).map(function(k) {
        chartData.push([k, totals[k]])
    });
    return chartData;
}

/**
 * get the date part from a date object
 * @param  {Date/String} date
 * @return {String} date in mm/dd/yyyy format
 */
function pullDate(date) {
    let d = new Date(date);

    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    let month = d.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let year = d.getFullYear();
    return  month + '/' + day + '/' + year; 
}

/**
 * get the time from a date object
 * @param  {Date/String} date
 * @return {String} time in HH:ii:ss format
 */
function pullTime(date) {
    let d = new Date(date);
    let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    let minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    return hours + ':' + minutes;
}