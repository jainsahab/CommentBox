var http=require('http');
var url=require('url');
var fs=require('fs');
var handler=require('./public/javascript/CommentsRoute.js').handler;
var outOfStock=function(request,response){
	response.writeHead(404, {'Content-Type': 'text/html'});	
	response.write("<h1>I don't have it, what you have requested.</h1>");	
}

var serve=function(request,response){
	var req_url=url.parse(request.url);
	var method = handler[req_url.pathname] || outOfStock;
	method(request,response);
}

var httpserver=http.createServer(serve).listen(8080);
console.log('Server Running at 8080');
