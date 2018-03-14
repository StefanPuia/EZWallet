window.addEventListener('load', function() {

	let currentDate = new Date();
	$('#sMonth').val(currentDate.getMonth() + 1);
	$('#sYear').val(currentDate.getFullYear());

	callServer('/api/category', {}, function(categories) {
        let select = $('#sCat');
        categories.forEach(function(category) {
            select.append(newEl('option', {
                value: category.id,
                textContent: category.cname
            }))
        })
        $('select').material_select();
    });

    getTransactions({}, function(transactions) {
    	let container = $('#recordList');
    	transactions.forEach(function(transaction) {
    		container.append(newRecEl(transaction));
    	})
    })

    Materialize.updateTextFields();

    $('#sButton').on('click', searchByDate);
    $('#sText').on('input', searchByFilter);
    $('#sCat').on('change', searchByCat)
    $('#sYear').on('input', fixYear);
})

function searchByFilter() {
	let filter = $('#sText').val().toLowerCase();
	let elements = $('#recordList li');

	for(let i = 0; i < elements.length; i++) {
		let content = elements[i].querySelector('p').textContent;
		if(content.indexOf(filter) > -1) {
			elements[i].style.display = '';
		}
		else {
			elements[i].style.display = 'none';
		}
	}
}

function searchByCat() {
	let category = $('#sCat option:selected').text();
	let elements = $('#recordList li');

	for(let i = 0; i < elements.length; i++) {
		let content = elements[i].querySelector('.title').textContent;
		if(content.indexOf(category) > -1) {
			elements[i].style.display = '';
		}
		else {
			elements[i].style.display = 'none';
		}
	}
}

function searchByDate() {
	let data = {
		month: $('#sMonth').val(),
		year: $('#sYear').val()
	}

	getTransactions(data, function(transactions) {
    	let container = $('#recordList');
    	container.html('');
    	transactions.forEach(function(transaction) {
    		container.append(newRecEl(transaction));
    	})
    })
}

function fixYear() {
	let input = $('#sYear');
	let val = parseInt(input.val());
	input.val(val);
}