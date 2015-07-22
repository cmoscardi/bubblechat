window.onload = function() {

  var messages = [];
  var messagesById = {};
  var activeMessage = { message: {id: null}};

	var socket = io.connect('http://45.55.183.36:9999');
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	var name = document.getElementById("name");
  var parentNode = document.getElementById("parent");
  var currentID = document.getElementById("currentId");
  //root nodes for each message tree

  var update = null;
	socket.on('message', function (data) {
		if(data.message) {
      mapMessage(data, activeMessage);
      if(!update){
        update = buildTree(messages, activeMessage);
      }
      else{
        update(messages[0]);
      }
		} else {
			console.log("There is a problem:", data);
		}
	});

	sendButton.onclick = sendMessage = function() {
    if(messages.length > 0 && !activeMessage.message.id){
      alert("Please click a message to reply to first");
      return;
    }
		if(name.value == "") {
			alert("Please type your name!");
		} else {
			var text = field.value;
			socket.emit('send', { message: text, username: name.value, parentId: activeMessage.message.id});
		}
	};

  function mapMessage(data){
    data.children = [];
    messagesById[data.id] = data;
    if(data.parentId){
      if(messagesById[data.parentId].children){
        messagesById[data.parentId].children.push(data);
      }
      else {
        messagesById[data.parentId].children = [data];
      }
    }
    else {
      messages.push(data);
    }
  }
}


$(document).ready(function() {
	$("#field").keyup(function(e) {
		if(e.keyCode == 13) {
			sendMessage();
		}
	});
});
