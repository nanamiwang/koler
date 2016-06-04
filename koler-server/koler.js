var express = require('express');
var app = express();
var _ = require('lodash');
var sock = require('socket.io');

var server = app.listen(4000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://%s:%s', host, port);
});

var io = sock.listen(server);

var users = [];

io.on('connection', function(socket){
	var sendOnlineUserList = function(s) {
		// 不发送用户本人的id
		s.emit('onlineUserList', _.map(_.reject(users, {'socket' : s.id }), 'id'));
	};
	socket.on('login', function(data){
		users.push({id: data.id, socket: socket.id, platform: data.platform});
		socket.user_id = data.id;
		console.log('User login: %s, platform: %s', data.id, data.platform);
		//发送在线用户列表
		sendOnlineUserList(socket);
	});

	socket.on('queryOnlineUserList', function(data){
		console.log('User %s requests online user list', socket.user_id);
		//发送在线用户列表
		sendOnlineUserList(socket);
	});

	socket.on('sendMessage', function(message){
		var peer_id = Number(message.peer_id);
		var user = _.find(users, { 'id': peer_id });
		if(!user) {
			return;
		}
		console.log(JSON.stringify(message));
		io.to(user.socket).emit('messageReceived', message);
	});

	socket.on('disconnect', function(){
		_.remove(users, function(user){
			return user.socket == socket.id;
		}).forEach(function(user) {
			console.log('User disconnected: %s, platform: %s', user.id, user.platform);
		});
		// 通知所有用户,该用户下线
		users.forEach(function(user) {
			sendOnlineUserList(io.to(user.socket));
		});
	});

});