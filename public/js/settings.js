'use strict';

window.addEventListener('load', function() {
    callServer('/api/budget', {}, function(budget) {
        $('#budget-input').val(budget);
    })

    $('#save-settings').on('click', saveSettings);
})

function saveSettings() {
    let budget = parseInt($('#budget-input').val());
    if (budget > 0) {
    	delete localStorage.isNewAccount;
    	setBudget(budget, function(data) {
    		window.location = '/';
    	})
    }
}