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

    const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
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
    // console.log(`${fetchOptions.method} ${fetchURL}`);

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
    // console.log(JSON.stringify(data, null, 4) + '\n\n');

    callback(data);
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
    callServer('api/user', {}, function(data) {
        console.log(data);
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
    window.location = "/";
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
    callServer('api/budget/', {}, function(data) {
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

    callServer('api/budget/', {
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
    callServer('api/transaction/', {
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

function calcBudget(month, year){
    let date = {
        'month': month,
        'year': year
    };
    if (!month || !year) {
        let d = new Date();
        date.month = d.getMonth() + 1;
        date.year = d.getFullYear();
    }

    getTransactions(date, function(transactions) {
        let moneySpent = 0;
        for (let i in transactions) {
            moneySpent += transactions[i].amount;
            console.log(transactions[i]);
        }
        getBudget(function(budget) {
            $('#current-balance').text("£" + (budget - moneySpent));
        });
    });
}
