window.onload = function() {

	var socket = io.connect('http://192.168.0.21:8080');
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	var name = document.getElementById("name");
  var parentNode = document.getElementById("parent");
  var currentID = document.getElementById("currentId");

	socket.on('message', function (data) {
		if(data.message) {
			messages.push(data);
      buildTree();
		} else {
			console.log("There is a problem:", data);
		}
	});

	sendButton.onclick = sendMessage = function() {
		if(name.value == "") {
			alert("Please type your name!");
		} else {
			var text = field.value;
			socket.emit('send', { message: text, username: name.value, parent: parseInt(parentNode.value)});
      buildTree();
			var html = '';
			for(var i=0; i<messages.length; i++) {
				html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
				html += messages[i].message + '<br />';
			}
			content.innerHTML = html;
			field.value = "";
		}
	};

}
$(document).ready(function() {
	$("#field").keyup(function(e) {
		if(e.keyCode == 13) {
      console.log("this should work");
			sendMessage();
		}
	});
});
