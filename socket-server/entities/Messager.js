const {io, userList} = require('../server');

class Messager {
	constructor(socket) {
		this.socket = socket;
	}

	message(message) {
		if (userList.has(this.socket.id)) {
			let user = userList.get(this.socket.id);
			console.log(`MESSAGE (${user.name}): ${message}`);
			io.emit('message.post', {
				text: message,
				name: user.name,
				colorCode: user.colorCode,
			});
		}
	}

	systemMessage(message, options) {
		if(!options?.hasOwnProperty('log') || options.log) {
			console.log("SYSTEM: " + message.text);
		}
		switch(options?.to) {
			case 'self':
				this.socket.emit('message.system', message);
				break;
			case 'others':
				this.socket.broadcast.emit('message.system', message);
			default:
				io.emit('message.system', message);			
		}
	}

	announce(message) {
		console.log("ANNOUNCEMENT: " + message.text);
		io.emit('message.announce', message);
	}
}

module.exports = { Messager };
