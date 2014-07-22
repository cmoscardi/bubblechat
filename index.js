var express = require("express");
var app = express();
var port = 8080;

app.set('views', __dirname + '/tpl');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.render("page.html");
});

app.get("/tree", function(req, res){
  res.render("tree.html");
});


var io = require('socket.io').listen(app.listen(port));

var messages = [];
var id = 1;
io.sockets.on('connection', function (socket) {
  console.log("connection established");
	for(var i=0;i<messages.length;i++){
		socket.emit('message',{ parent: messages[i].parent, username:messages[i].username, message: messages[i].message, id: messages[i].id});
	}
	socket.on('send', function (data) {
    data.id = id++;
		messages.push(data);
		io.sockets.emit('message', data);
		console.log('message received... '+ data);
	});
});
console.log("Listening on port " + port);
