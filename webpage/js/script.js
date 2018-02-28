(function($){
  $(function(){
    $('.button-collapse').sideNav();
  }); 
})(jQuery);

function empty(string){
	if (string == '' || !string)
		return true;
	return false;
}

function refresh_captcha(id){
	var src = document.getElementById(id).src;
	var rand = Math.random();
	src = src + '?' + rand;
	document.getElementById(id).src = src;
}

$(document).ready(function(){
	$('input[id=currency]').focus(function(){
		$(this).attr('placeholder', 'e.g. GBP, USD, EUR');
	})

	$('input[id=currency]').blur(function(){
		if(!$(this).val())
			$(this).attr('placeholder', '');
	})

	$('#createTransactionSelect').change(function(){
		if($(this).val() == 'Create a service')
			window.location.href = "?m=services";
	})

	$('.transactionInfoTrigger').click(function(){
		var id = $(this).data('id');
		var url = 'includes/ajax/transactionInfo.php?id=' + id;
		$.get(url, function(data){
			var string = data;
			$('#modal_transactionInfo_content').html(string);
		})
	})

	$('.deleteTransaction').click(function(){
		var id = $(this).data('id');
		var response = confirm('Are you sure you want to delete the transaction?\nThis action is irreversible!');
		if(response == true)
			window.location.href = '?m=history&delete=' + id;
	})

	$('.deleteService').click(function(){
		var id = $(this).data('id');
		var response = confirm('Are you sure you want to delete the service?\nThis action is irreversible!');
		if(response == true)
			window.location.href = '?m=services&delete=' + id;
	})

	$('.modal-trigger').leanModal();
	$('select').material_select();
})