var http=require('http');
var url=require('url');
var fs=require('fs');
var htmlFileData=fs.readFileSync('./public/clientPage.html','utf-8');
var step=fs.readFileSync('./Photos/step.jpg');
var banner=fs.readFileSync('./public/images/banner.png');
var cssTemplate=fs.readFileSync('./public/stylesheets/mystyle.css');
var favicon=fs.readFileSync('./public/images/icon.ico');
var background=fs.readFileSync('./public/images/bg.jpg');
var commentsArray=fs.readFileSync('comments.txt','utf-8') && JSON.parse(fs.readFileSync('comments.txt',"utf-8")) || [];

var handler={};

var GetReadableCommentsFromObject=function(commentsArray){
	return commentsArray.map(function(obj){
		return '<b>' + obj.name+' </b>: ' +obj.comment;
	});
}

handler['/']=function(request,response){
	var listComment=GetReadableCommentsFromObject(commentsArray);
	response.writeHead(200, {'Content-Type': 'text/html'});	
	response.write(htmlFileData.replace(/{COMMENT}/,listComment.join('<br>')));
}

handler['/clientPage.html']=function(request,response){
	var req_url = url.parse(request.url,true);
	var query = req_url.query; 
	var name=query.name;
	var comment=query.comment;
	name && comment && commentsArray.push(query) && fs.writeFile('comments.txt',JSON.stringify(commentsArray));
	var listComment=GetReadableCommentsFromObject(commentsArray);		
	response.writeHead(200,{'Content-Type': 'text/html'});
	response.write(htmlFileData.replace(/{COMMENT}/,listComment.join('<br>')));	
}

handler['/images/step.jpg']=function(request,response){
	response.writeHead(200, {'Content-Type': 'image/jpeg'});	
	response.write(step);
}

handler['/images/bg.jpg']=function(request,response){
	response.writeHead(200, {'Content-Type': 'image/jpeg'});	
	response.write(background);
}

handler['/images/banner.png']=function(request,response){
	response.writeHead(200, {'Content-Type': 'image/jpeg'});	
	response.write(banner);
}

handler['/CSS/mystyle.css']=function(request,response){
	response.writeHead(200, {'Content-Type': 'image/css'});	
	response.write(cssTemplate);
}

handler['/favicon.ico']=function(request,response){
	response.writeHead(200, {'Content-Type': 'image/x-icon'});	
	response.write(favicon);
}

var outOfStock=function(request,response){
	response.writeHead(404, {'Content-Type': 'text/html'});	
	response.write("<h1>I don't have it, what you have requested.</h1>");	
}

var serve=function(request,response){
	var req_url=url.parse(request.url);
	var method = handler[req_url.pathname] || outOfStock;
	method(request,response);
	response.end();
}

var main=function(){
	var httpserver=http.createServer(serve).listen(8080);
}
console.log('Server Running at 8080');
main();