(function(){
	angular.module('starter')
	.service('SocketService', ['socketFactory', SocketService]);
	function SocketService(socketFactory){
		var sf = socketFactory({
			ioSocket: io.connect('http://121.42.156.26:4000')
		});
		return sf;
	}
})();