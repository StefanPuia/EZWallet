$(document).ready(function(){
	$('input[name=username]').blur(function(){
		var input = $('input[name=username]').val();
		var posting = $.post("includes/ajax/register.php", { type: "username", value: input } );

		posting.done(function( data ){
			if(data != '0'){
				if(!empty(input)){
					$('#usernamediv').removeClass('valid');
					$('#usernamediv').addClass('invalid');
					$('label[for=username]').text('Username - already in use');
				}
			}
			else{
				if(!empty(input)){
					$('#usernamediv').removeClass('invalid');
					$('#usernamediv').addClass('valid');
					$('label[for=username]').text('Username');
				}
			}
		});
	});

	$('input[name=password2]').blur(function(){
		var pass1 = $('input[name=password1]').val();
		var pass2 = $('input[name=password2]').val();

		if(!empty(pass1, pass2)){
			if(pass1 != pass2){
				$('#password1div').removeClass('valid');
				$('#password2div').removeClass('valid');
				$('#password1div').addClass('invalid');
				$('#password2div').addClass('invalid');
				$('label[for=password2]').text('Re-enter Password - passwords must match');
			}
			else{
				$('#password1div').removeClass('invalid');
				$('#password2div').removeClass('invalid');
				$('#password1div').addClass('valid');
				$('#password2div').addClass('valid');
				$('label[for=password2]').text('Re-enter Password');
			}
		}
	});

	$('input[name=email]').blur(function(){
		var input = $('input[name=email]').val();
		var posting = $.post("includes/ajax/register.php", { type: "email", value: input } );

		posting.done(function( data ){
			if(data != '0'){
				if(!empty(input)){
					$('#emaildiv').removeClass('valid');
					$('#emaildiv').addClass('invalid');
					$('label[for=email]').text('Email - already in use');
				}
			}
			else{
				if(!empty(input)){
					$('#emaildiv').removeClass('invalid');
					$('#emaildiv').addClass('valid');
					$('label[for=email]').text('Email');
				}
			}
		});
	});


});

