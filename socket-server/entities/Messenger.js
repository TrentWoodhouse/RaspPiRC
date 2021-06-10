class Messenger {
	constructor(io, socket, state) {
		this.io = io;
		this.socket = socket;
		this.state = state;
	}

	message(message) {
		if (this.state.userList.has(this.socket.id)) {
			let user = this.state.userList.get(this.socket.id);
			console.log(`MESSAGE: (${user.name}) ${message}`);
			this.io.emit('message.post', {
				text: message,
				name: user.name,
				colorCode: user.colorCode,
				type: 'message',
				timestamp: Date.now()
			});
		}
	}

	systemMessage(message, options) {
		let messageObj = {
			text: message,
			type: 'system',
			timestamp: Date.now()
		}

		if(!options || (!options.hasOwnProperty('log') || options.log)) {
			console.log("SYSTEM: " + message);
		}

		switch(options && options.to) {
			case 'self':
				this.socket.emit('message.post', messageObj);
				break;
			case 'others':
				this.socket.broadcast.emit('message.post', messageObj);
				break;
			case 'noone':
				break;
			default:
				this.io.emit('message.post', messageObj);			
		}
	}

	announce(message) {
		console.log("ANNOUNCEMENT: " + message);
		this.io.emit('message.post', {
			text: message,
			type: 'announcement',
			timestamp: Date.now()
		});
	}
}

module.exports = { Messenger };
