var express = require('express');
var app = express();

var path = require('path');
var querystring = require('querystring');

var server = app.listen(7000);

var io = require('socket.io').listen(server);
var messages = [];

io.sockets.on('connection', function(socket) {
	socket.on('new_user_entered', function(name) {
		var sessionid = socket.id;

		socket.emit('new_user_name', {name: name.new_user_name});

		io.emit('all_messages', {all_messages: messages});
	})

	socket.on('new_message', function(message) {
		var new_message = querystring.parse(message.new_message);
		messages.push({name: new_message.name, content: new_message.content});
		io.emit('all_messages', {all_messages: messages});
	})
})

app.use(express.static(path.join(__dirname, '/static')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('index');
})