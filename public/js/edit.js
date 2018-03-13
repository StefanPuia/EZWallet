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
            // activate the select jQuery plugin
        $('select').material_select();
    });

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

    $('#transaction_set_income').on('click', setIncome);
    $('#transaction_set_expense').on('click', setExpense);
    $('#transaction_amount').on('input', setAmountSign);
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
	let timestamp = $('#transaction_date').val() + ' ' + $('#transaction_time').val();
	if(isNaN(Date.parse(timestamp))) {
		timestamp = new Date().toString();
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

    callServer('api/transaction/', options, function(res) {
        if (res.response != "Created") {
            $('#sendTButton').text("Error");
            console.log(res);
            setTimeout(function() {
                $('#sendTButton').text("Add")
            }, 2000);
        } else {
        	window.location = '/';
        }
    });
}