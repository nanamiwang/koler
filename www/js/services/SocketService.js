angular.module('starter')
.service('SocketService', function(socketFactory){
	var sf = socketFactory({
		ioSocket: io.connect('http://121.42.156.26:4000')
	});
	return sf;
});