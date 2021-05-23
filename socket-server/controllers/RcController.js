let fs = require('fs');
let { UserController } = require('./UserController');
let { RCCar } = require('../entities/RCCar');
let { config } = require('../config');

const RcController = {
	join(socket) {
		if(!RC) {
			console.log('RC car is connected');
			let ip = socket.request.connection.remoteAddress;
			if (ip.substr(0, 7) == "::ffff:") {
				ip = ip.substr(7)
			}
			RC = new RCCar(socket.id, ip);
			UserController.updateState({
				rc: RC,
			});
			socket.broadcast.emit('message.post', {
				message: "RC car has connected",
				isAnnouncement: true,
			});
		}
		else {
			socket.disconnect();
		}
	},
	data(socket, data) {
		if(RC && queue.size() > 0 && queue.getFirst().id === socket.id) {
			io.to(RC.id).emit('rc.data', data);
		}
	},
	disconnect(socket, data) {
		console.log('RC car disconnected');
		RC = null;
		UserController.updateState({
			rc: RC,
		});
		socket.broadcast.emit('message.post', {
			message: "RC car has disconnected",
			isAnnouncement: true,
		});
	},
}

module.exports = { RcController };
