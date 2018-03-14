window.addEventListener('load', function() {
	google.charts.load('current', {'packages':['corechart']});

	calcBudget(null, null, function(budget) {
		$('#current-balance').text('£' + budget);

		getTransactions({}, function(transactions) {
			let list = $('#recordList');
			drawChart(calcTotals(budget, transactions), 'Monthly Spendings', $('#expenses-chart').get()[0])
			transactions.reverse().slice(0, 5);
			transactions.forEach(function(transaction) {
				list.prepend(newRecEl(transaction));
			})
		})
	})
})