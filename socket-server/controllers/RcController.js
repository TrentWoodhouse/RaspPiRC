let { RCCar } = require('../entities/RCCar');

class RcController {
	constructor(socket, state, messenger) {
		this.socket = socket;
		this.state = state;
		this.messenger = messenger;
	}

	join() {
		if(!this.state.rc) {
			let ip = this.socket.request.connection.remoteAddress;
			if (ip.substr(0, 7) == "::ffff:") {
				ip = ip.substr(7)
			}
			this.state.setRc(new RCCar(this.socket.id, ip)).broadcast();
			this.messenger.systemMessage('RC car has connected');
		}
		else {
			this.socket.disconnect();
		}
	}

	disconnect() {
		this.state.setRc(null).broadcast();
		this.messenger.systemMessage('RC car has disconnected');
	}
}

module.exports = { RcController };
