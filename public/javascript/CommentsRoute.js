var handler={};	
var fs=require('fs');
var url=require('url');
var mailer=require('nodemailer');
 var querystring = require("querystring"); 
var commentsArray=fs.readFileSync('comments.txt','utf-8') && JSON.parse(fs.readFileSync('comments.txt',"utf-8")) || [];
var clientPage=fs.readFileSync('./public/clientPage.html','utf-8');
var home=fs.readFileSync('./public/Home.html','utf-8');
var login=fs.readFileSync('./public/Login.html','utf-8');
var signUp=fs.readFileSync('./public/signUp.html','utf-8');
var contact=fs.readFileSync('./public/contact.html','utf-8');
var forgetPassword=fs.readFileSync('./public/ForgetPassword.html')
var cssForSignUpandLogin=fs.readFileSync('./public/stylesheets/mystyle.css');
var cssAfterLogin=fs.readFileSync('./public/stylesheets/style.css');
var step=fs.readFileSync('./Photos/step.jpg');
var banner2=fs.readFileSync('./public/images/banner2.png');
var logo=fs.readFileSync('./public/images/logo.png');
var logo2=fs.readFileSync('./public/images/logo2.png');
var viewmap=fs.readFileSync('./public/images/map.jpg')
var img1=fs.readFileSync('./public/images/img1.jpg');
var img2=fs.readFileSync('./public/images/img2.jpg');
var img3=fs.readFileSync('./public/images/img3.png');
var img4=fs.readFileSync('./public/images/img4.jpg');
var favicon=fs.readFileSync('./public/images/icon2.ico');
var background=fs.readFileSync('./public/images/bg.jpg');
var peoplesInfo=fs.readFileSync('PeopleInfo.txt','utf-8') && JSON.parse(fs.readFileSync('PeopleInfo.txt','utf-8')) || [];
var validation=fs.readFileSync('./public/javascript/validation.js','utf-8');
var UserNameForSession='';
var ContentType={html:'text/html',imgJpg:'image/jpeg',css:'image/css',icon:'image/x-icon',imgPng:'image/png',javascript:'text/javascript'}
var GetReadableCommentsFromObject=function(commentsArray){
	return commentsArray.map(function(obj){
		return '<b>' + obj.name+' </b>: ' +obj.comment;
	});
}


var renderer=function(response,type,text){
	response.writeHead(200,{'ContentType':type});
	response.write(text);
	response.end();
}

handler['/']=function(request,response){
	var listComment=GetReadableCommentsFromObject(commentsArray);
	renderer(response,ContentType.html,home);
}

var credentialsMatch=function(email,password){
	return peoplesInfo.some(function(obj){
		if(obj.emailid == email && obj.pswd == password ){
			UserNameForSession=obj.username;
			return true;
		}
		return false;
	})
}

handler['/authentication']=function(request,response){
	request.setEncoding('utf8');
	request.on('data',function(postData){
		var email=querystring.unescape(postData.split('&')[0].split('=')[1]);
		var pswd = querystring.unescape(postData.split('&')[1].split('=')[1]);
		if(credentialsMatch(email,pswd)){
			var listComment=GetReadableCommentsFromObject(commentsArray);
			renderer(response,ContentType.html,clientPage.replace(/{COMMENT}/,listComment.join('<br>')).replace(/{USERNAME}/,UserNameForSession));
		}
		else
			renderer(response,ContentType.html,'<h1>Authentication Failed</h1>');	
	});
}

var GetUserDataObject=function(postData){
	var obj={};
	postData.split('&').forEach(function(entity){
		var singleInfo=entity.split('=');
		obj[singleInfo[0]]=singleInfo[1];
	})
	return obj;
}


var CheckForExistence=function(email,response){
	var UserNotExist= peoplesInfo.every(function(obj){
						return email != obj.emailid;
       				  })
	if(!UserNotExist)
		renderer(response,ContentType.html,'<h1>User already Exist, Please Use another Email ID</h1>');
	else
		return true;
}

handler['/ToRegisterUser']=function(request,response){
	request.setEncoding('utf-8');
	request.on('data',function(postData){
		var userInfo=GetUserDataObject(querystring.unescape(postData).replace(/\+/g,' '));
		var UserDoesNotExist=CheckForExistence(userInfo.emailid,response);
		if(UserDoesNotExist){
			delete userInfo['cpswd'];
			peoplesInfo.push(userInfo);
			fs.writeFile('PeopleInfo.txt',JSON.stringify(peoplesInfo));
			renderer(response,ContentType.html,login);
		}
	})
}

var getPassword=function(Email){
	return peoplesInfo.filter(function(obj){
		return obj.Remail==Email;
	})[0].pswd;
}

var sendMail=function(UserPassword,forgottenPasswordEmail){
	var smtpTransport = mailer.createTransport("SMTP",{
		    service: "Gmail",
		    auth: {
		        user: "getitback911@gmail.com",
		        pass: "ggeetitback"
		    }
		});
		var mailOptions = {
		    to: forgottenPasswordEmail,
		    subject: "Account Recovery Password",
		    text: "Your Password is "+UserPassword+".",
		    html: "<b>Your Password is "+UserPassword+".</b>"
			}
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent: " + response.message);
	    }
	    smtpTransport.close(); 
	});
}

handler['/SendPassword']=function(request,response){
	request.setEncoding('utf-8');
	request.on('data',function(postData){
		var forgottenPasswordEmail=querystring.unescape(postData).split('=')[1];
		var UserPassword=getPassword(forgottenPasswordEmail)
		sendMail(UserPassword,forgottenPasswordEmail);
		renderer(response,ContentType.html,'<h1>Recovery mail has been sent to your ID</h1>');
	});	
}

handler['/forgetpassword.html']=function(request,response){
	renderer(response,ContentType.html,forgetPassword);
}

handler['/contact.html']=function(request,response){
	renderer(response,ContentType.html,contact);
}

handler['/signUp.html']=function(request,response){
	renderer(response,ContentType.html,signUp);
}

handler['/Login.html']=function(request,response){
	renderer(response,ContentType.html,login);
}

handler['/clientPage.html']=function(request,response){
	request.setEncoding('utf8');
	request.on('data',function(data){
		var query={};
		query.name=querystring.unescape(data.split('&')[0].split('=')[1]).replace(/\+/g,' ');
		query.comment=querystring.unescape(data.split('&')[1].split('=')[1]).replace(/\+/g,' ');
		query.name && query.comment && commentsArray.push(query) && fs.writeFile('comments.txt',JSON.stringify(commentsArray));
		var listComment=GetReadableCommentsFromObject(commentsArray);		
		UserNameForSession = query.name;		
		renderer(response,ContentType.html,clientPage.replace(/{COMMENT}/,listComment.join('<br>')).replace(/{USERNAME}/,UserNameForSession));	
	});
}

handler['/images/map.jpg']=function(request,response){
	renderer(response,ContentType.imgJpg,viewmap);
}

handler['/img1.jpg']=function(request,response){
	renderer(response,ContentType.imgJpg,img1);
}

handler['/img2.jpg']=function(request,response){
	renderer(response,ContentType.imgJpg,img2);
}

handler['/img3.png']=function(request,response){
	renderer(response,ContentType.imgPng,img3);
}

handler['/img4.jpg']=function(request,response){
	renderer(response,ContentType.imgJpg,img4);
}

handler['/images/step.jpg']=function(request,response){
	renderer(response,ContentType.imgJpg,step);
}

handler['/bg.jpg']=function(request,response){
	renderer(response,ContentType.imgJpg,background);
}


handler['/banner2.png']=function(request,response){
	renderer(response,ContentType.imgPng,banner2);
}

handler['/logo.png']=function(request,response){
	renderer(response,ContentType.imgPng,logo);
}

handler['/logo2.png']=function(request,response){
	renderer(response,ContentType.imgPng,logo2);
}

handler['/stylesheets/mystyle.css']=function(request,response){
	renderer(response,ContentType.css,cssForSignUpandLogin);
}



handler['/stylesheets/style.css']=function(request,response){
	renderer(response,ContentType.css,cssAfterLogin);
}

handler['/favicon.ico']=function(request,response){
	renderer(response,ContentType.icon,favicon);
}

handler['/validation']=function(request,response){
	renderer(response,ContentType.javascript,validation);
}
exports.handler=handler;