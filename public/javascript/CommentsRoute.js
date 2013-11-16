var handler={};
var fs=require('fs');
var url=require('url');
 var querystring = require("querystring"); 
var commentsArray=fs.readFileSync('comments.txt','utf-8') && JSON.parse(fs.readFileSync('comments.txt',"utf-8")) || [];
var htmlFileData=fs.readFileSync('./public/clientPage.html','utf-8');
var login=fs.readFileSync('./public/Login.html','utf-8');
var cssTemplate=fs.readFileSync('./public/stylesheets/mystyle.css');
var cssHomeTemplate=fs.readFileSync('./public/stylesheets/style.css');
var step=fs.readFileSync('./Photos/step.jpg');
var banner=fs.readFileSync('./public/images/banner.png');
var banner2=fs.readFileSync('./public/images/banner2.png');
var logo=fs.readFileSync('./public/images/logo.png');
var favicon=fs.readFileSync('./public/images/icon2.ico');
var background=fs.readFileSync('./public/images/bg.jpg');
var peopleInfo=JSON.parse(fs.readFileSync('PeopleInfo.txt','utf-8'));

var ContentType={html:'text/html',imgJpg:'image/jpeg',css:'image/css',icon:'image/x-icon',imgPng:'image/png'}
var GetReadableCommentsFromObject=function(commentsArray){
	return commentsArray.map(function(obj){
		return '<b>' + obj.name+' </b>: ' +obj.comment;
	});
}

var GetNameFromIP=function(remoteIP){
	var name=peopleInfo.filter(function(obj){
		console.log(obj.name);
		if(remoteIP==obj.ip)
			return obj;
	})
	console.log('Name is ',name,typeof(name));
	return name;
}

var renderer=function(response,type,text){
	response.writeHead(200,{'ContentType':type});
	response.write(text);
	response.end();
}

handler['/']=function(request,response){
	var listComment=GetReadableCommentsFromObject(commentsArray);
	renderer(response,ContentType.html,login);
}

handler['/validation']=function(request,response){
	request.setEncoding('utf8');
	request.on('data',function(postData){
		var userName=postData.split('&')[0].split('=')[1];
		var pswd = postData.split('&')[1].split('=')[1];
		if(userName=='manish' && pswd=='prateek'){
			var listComment=GetReadableCommentsFromObject(commentsArray);
			renderer(response,ContentType.html,htmlFileData.replace(/{COMMENT}/,listComment.join('<br>')))
		}
		else{
			console.log('Authentication Failed');
			renderer(response,ContentType.html,'<h1>Authentication Failed</h1>');	
		}
	});
}


handler['/clientPage.html']=function(request,response){
	request.setEncoding('utf8');
	request.on('data',function(data){
		var query={};
		query.name=querystring.unescape(data.split('&')[0].split('=')[1]).replace(/\+/g,' ');
		query.comment=querystring.unescape(data.split('&')[1].split('=')[1]).replace(/\+/g,' ');
		query.name && query.comment && commentsArray.push(query) && fs.writeFile('comments.txt',JSON.stringify(commentsArray));
		var listComment=GetReadableCommentsFromObject(commentsArray);		
		renderer(response,ContentType.html,htmlFileData.replace(/{COMMENT}/,listComment.join('<br>')));	
	});
}

handler['/images/step.jpg']=function(request,response){
	renderer(response,ContentType.imgJpg,step);
}

handler['/images/bg.jpg']=function(request,response){
	renderer(response,ContentType.imgJpg,background);
}

handler['/images/banner.png']=function(request,response){
	renderer(response,ContentType.imgPng,banner);
}

handler['/images/banner2.png']=function(request,response){
	renderer(response,ContentType.imgPng,banner2);
}

handler['/images/logo.png']=function(request,response){
	renderer(response,ContentType.imgPng,logo);
}

handler['/stylesheets/mystyle.css']=function(request,response){
	renderer(response,ContentType.css,cssTemplate);
}


handler['/stylesheets/style.css']=function(request,response){
	renderer(response,ContentType.css,cssHomeTemplate);
}

handler['/favicon.ico']=function(request,response){
	renderer(response,ContentType.icon,favicon);
}

exports.handler=handler;