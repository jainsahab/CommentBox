var Validate=function(){
	var emailPattern=/^[_A-Za-z0-9]+@commentbox.com/;
	var namePattern=/^[0-9]/;
	var name=document.getElementById('name').value;
	var email=document.getElementById('email').value;
	var password=document.getElementById('password').value;
	var cpassword=document.getElementById('cpassword').value;
	if(namePattern.test(name)){
		alert('Name can\'t be start with Number.');
		document.getElementById('name').focus();
		return false;
	}
	if(!emailPattern.test(email)){
		alert('Invalid Mail');
		document.getElementById('email').focus();
		return false;
	}
	if(password=='' || cpassword==''){
		alert('Password field can\'t be empty.');
		document.getElementById('password').focus();
		return false;	
	}
	if(password != cpassword){
		alert('Password doesn\'t match');
		document.getElementById('cpassword').focus();
		return false;	
	}
	if(password.length <= 8){
		alert('Password should be more than 8 characters. ');
		document.getElementById('password').focus();
		return false;	
	}
	return true;
}