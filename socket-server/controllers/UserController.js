const { io, state } = require('../server');
const { User } = require('../entities/User');

class UserController {
	constructor(socket, messager) {
		this.socket = socket;
		this.messager = messager;
	}

	join(name) {
		if(!state.userExists(this.socket.id)) {
			this.messager.systemMessage(`${name} has joined`, {to: 'others'});
			this.messager.systemMessage(`You have joined as ${name}`, {to: 'self', log: false});
			state.addUser(new User(this.socket.id, name)).broadcast();
		}
	}

	enqueue() {
		state.enqueueUser(this.socket.id).broadcast();
	}

	dequeue() {
		state.dequeueUser(this.socket.id).broadcast();
	}

	sendData(data) {
		if(state.rc && !state.queue.isEmpty() && state.queue.getFirst().id === this.socket.id) {
			io.to(state.rc.id).emit('rc.data', data);
		}
	}

	disconnect() {
		if (state.userExists(this.socket.id)) {
			let user = state.userList.get(this.socket.id);
			this.messager.systemMessage(`${user.name} has left`);
			state.removeUser(this.socket.id);
		}
		state.dequeueUser(this.socket.id).broadcast();
	}
}

module.exports = { UserController };
