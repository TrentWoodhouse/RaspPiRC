let { io, state } = require('../server');
let { UserController } = require('./UserController');
let { RCCar } = require('../entities/RCCar');

class RcController {
	constructor(socket, messager) {
		this.socket = socket;
		this.messager = messager;
	}

	join() {
		if(!state.rc) {
			let ip = this.socket.request.connection.remoteAddress;
			if (ip.substr(0, 7) == "::ffff:") {
				ip = ip.substr(7)
			}
			state.setRc(new RCCar(this.socket.id, ip)).broadcast();
			this.messager.systemMessage('RC car has connected');
		}
		else {
			socket.disconnect();
		}
	}

	disconnect() {
		state.setRc(null).broadcast();
		this.messager.systemMessage('RC car has disconnected');
	}
}

module.exports = { RcController };
