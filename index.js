var express = require("express");
var app = express();
var port = 80;

app.set('views', __dirname + '/tpl');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.render("page.html");
});


var io = require('socket.io').listen(app.listen(port));

var messages = [];
io.sockets.on('connection', function (socket) {
	socket.emit('message', { message: 'welcome to the chat' });
	for(var i=0;i<messages.length;i++){
		socket.emit('message',{ username:messages[i].username, message: messages[i].message});
	}
	socket.on('send', function (data) {
		messages.push(data);
		io.sockets.emit('message', data);
		console.log('message received... '+ data);
	});
});
console.log("Listening on port " + port);
