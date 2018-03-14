'use strict';

let transactionType = 'expense';

window.addEventListener('load', function() {
    // populate the category select with all categories from the database
    callServer('/api/category', {}, function(categories) {
        let select = $('#transaction_category');
        categories.forEach(function(category) {
                select.append(newEl('option', {
                    value: category.id,
                    textContent: category.cname
                }))
            })
    });

    activateJQueryPlugins();

    $('#transaction_set_income').on('click', setIncome);
    $('#transaction_set_expense').on('click', setExpense);
    $('#transaction_amount').on('input', setAmountSign);

    if(getParameterValue('edit')) {
        $('#page-title').text('Edit record');
        $('#sendTButton').text('Save');
        $('#sendTButton').on('click', saveTrans);

        $('#deleteTButton').show();
        $('#deleteTButton').on('click', deleteTrans);

        callServer('/api/transaction/' + getParameterValue('edit'), {}, function(transaction) {
            $('#transaction_amount').val(transaction.amount);

            $('#transaction_category').val(transaction.cid);

            $('#transaction_description').val(transaction.description);

            $('#transaction_date').val(pullDate(transaction.date));
            $('#transaction_time').val(pullTime(transaction.date));

            if(transaction.amount < 0) {
                setExpense();
            } else {
                setIncome();
            }

            activateJQueryPlugins();


        })
    } else {
        $('#sendTButton').on('click', sendTrans);
    }
})

/**
 * set the transaction to income
 */
function setIncome() {
    transactionType = 'income';
    let input = $('#transaction_amount');
    let val = parseFloat(input.val());
    val = Math.abs(val);
    input.val(val);
    $('#transaction_set_income').addClass('accent-4');
    $('#transaction_set_income').removeClass('accent-2');
    $('#transaction_set_expense').addClass('accent-2');
    $('#transaction_set_expense').removeClass('accent-4');
}

/**
 * set the transaction to expense
 */
function setExpense() {
    transactionType = 'expense';
    let input = $('#transaction_amount');
    let val = parseFloat(input.val());
    val = Math.abs(val) * -1;
    input.val(val);
    $('#transaction_set_expense').addClass('accent-4');
    $('#transaction_set_expense').removeClass('accent-2');
    $('#transaction_set_income').addClass('accent-2');
    $('#transaction_set_income').removeClass('accent-4');
}

/**
 * set the amount sign depending on the transaction type
 */
function setAmountSign() {
    let input = $('#transaction_amount');
    let val = parseFloat(input.val());
    if (isNaN(val)) {
        val = 0;
    }

    input.val(val);

    switch (transactionType) {
        case 'expense':
            setExpense();
            break;

        case 'income':
            setIncome();
            break;
    }
}

/**
 * send transactions to the server
 */
function sendTrans() {
    let currentTime = new Date();
    let time = $('#transaction_time').val();
    time = (time != '') ? time : currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
	let timestamp = $('#transaction_date').val() + ' ' + time;
	if(isNaN(Date.parse(timestamp))) {
		timestamp = currentTime.toString();
	}

	let category = $('#transaction_category').val();
	if(!category) {
		category = 0;
	}

    let payload = {
        amount: $('#transaction_amount').val(),
        description: $('#transaction_description').val() ? $('#transaction_description').val() : ' ',
        tdate: timestamp,
        category: category,
    };

    let options = {
        body: JSON.stringify(payload),
        method: "POST"
    }

    $('#sendTButton').text("Adding");

    callServer('/api/transaction/', options, function(res) {
        if (res.response != "Created") {
            $('#sendTButton').text("Error");
            setTimeout(function() {
                $('#sendTButton').text("Add")
            }, 2000);
        } else {
        	window.location = '/';
        }
    });
}

function deleteTrans() {
    let id = getParameterValue('edit');
    if(id && window.confirm('Are you sure you want to delete this transaction? This action is irreversible!')) {
        callServer('/api/transaction/' + id, {method: 'delete'}, function() {
            window.location = '/';
        })
    }
}

function saveTrans() {
    let currentTime = new Date();
    let time = $('#transaction_time').val();
    time = time != '' ? time : currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();
    let timestamp = $('#transaction_date').val() + ' ' + time;
    if(isNaN(Date.parse(timestamp))) {
        timestamp = currentTime.toString();
    }

    let category = $('#transaction_category').val();
    if(!category) {
        category = 0;
    }

    let payload = {
        amount: $('#transaction_amount').val(),
        description: $('#transaction_description').val() ? $('#transaction_description').val() : ' ',
        tdate: timestamp,
        category: category,
    };

    let options = {
        body: JSON.stringify(payload),
        method: "POST"
    }

    $('#sendTButton').text("Saving");

    callServer('/api/transaction/' + getParameterValue('edit'), options, function(res) {
        if (res.response != "OK") {
            $('#sendTButton').text("Error");
            setTimeout(function() {
                $('#sendTButton').text("Save")
            }, 2000);
        } else {
            window.location = '/';
        }
    });
}

function activateJQueryPlugins() {
    // activate the select jQuery plugin
    $('select').material_select();

    // activate the datepicker plugin
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false // Close upon selecting a date,
    });
    // activate the timepicker plugin
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

    Materialize.updateTextFields();
}