function getQueryString(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};

function $(query) {
    return document.querySelector(query);
}

function jsonToQueryString(json) {
    return '?' +
        Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();

    $('#button-google-signin').style.display = 'none';
    $('#button-signout').style.display = '';

    signIn();
}
async function signOut() {
    await gapi.auth2.getAuthInstance().signOut();

    $('#button-google-signin').style.display = '';
    $('#button-signout').style.display = 'none';
}

async function callServer(fetchURL, method, payload) {
    const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

    let el = $('#server-response');
    el.textContent = 'loading…';

    const fetchOptions = {
        credentials: 'same-origin',
        method: method,
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    };

    console.log(`${method} ${fetchURL}`);

    if (payload) {
        let data = JSON.stringify(payload);
        fetchOptions.body = data;
        fetchOptions.headers['Content-Type'] = 'application/json';
        fetchOptions.headers['Accept'] = 'application/json';
    }

    const response = await fetch(fetchURL, fetchOptions);
    if (!response.ok) {
        // handle the error
        el.textContent = "Server error:\n" + response.status;
        return;
    }

    // handle the response
    let data = await response.text();
    if (!data) {
        data = JSON.stringify({err: "error on fetch"});
    }

    try {
        data = JSON.parse(data);
    } catch(err) {
        data = {response: data};
    }

    el.textContent = JSON.stringify(data, null, 4);
    console.log(JSON.stringify(data) + '\n\n');
}

function getQueryString(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};

window.addEventListener('load', () => {
    if (typeof googleUser == 'undefined') {
        $('#button-google-signin').style.display = '';
        $('#button-signout').style.display = 'none';
    }
    $('body').style.display = '';
})

function signIn() {
    let fetchURL = 'api/user/login';
    callServer(fetchURL, 'POST', null);
}

function getDetails() {
    const apiOptions = {
        id: $('#user_id').checked,
        fname: $('#user_fname').checked,
        lname: $('#user_lname').checked,
        email: $('#user_email').checked,
        budget: $('#user_budget').checked,

    }
    let fetchURL = 'api/user/' + $('#userid').value + jsonToQueryString(apiOptions);
    callServer(fetchURL, 'GET', null);
}

function getBudget() {
    let fetchURL = 'api/budget/';
    callServer(fetchURL, 'GET', null);
}

function getOwnDetails() {
    const apiOptions = {
        id: $('#user_id').checked,
        fname: $('#user_fname').checked,
        lname: $('#user_lname').checked,
        email: $('#user_email').checked,
        budget: $('#user_budget').checked,

    }
    let fetchURL = 'api/user/' + jsonToQueryString(apiOptions);
    callServer(fetchURL, 'GET', null);
}

function setBudget() {
    let fetchURL = 'api/budget/';
    let payload = {
        budget: $('#user_input').value
    };

    callServer(fetchURL, 'POST', payload);
}

function getTransactions() {
    callServer('api/transaction', 'GET');
}

function getTransaction() {
    let fetchURL = 'api/transaction/' + $('#user_input').value;
    callServer(fetchURL, 'GET', null);
}

function deleteTransaction() {
    let fetchURL = 'api/transaction/' + $('#user_input').value;
    callServer(fetchURL, 'DELETE', null);
}

function addTransaction() {
    let fetchURL = 'api/transaction/';
    let payload = {
        amount: $('#transaction_val').value,
        description: $('#transaction_desc').value,
        tdate: $('#transaction_date').value,
        category: $('#transaction_cat').value
    };
    callServer(fetchURL, 'POST', payload);
}