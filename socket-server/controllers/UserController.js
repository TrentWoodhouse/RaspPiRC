const { User } = require('../entities/User');

class UserController {
	constructor(io, socket, state, messager) {
		this.io = io;
		this.socket = socket;
		this.state = state;
		this.messager = messager;
	}

	join(name) {
		if(!this.state.userExists(this.socket.id)) {
			this.messager.systemMessage(`${name} has joined`, {to: 'others'});
			this.messager.systemMessage(`You have joined as ${name}`, {to: 'self', log: false});
			this.state.addUser(new User(this.socket.id, name, this.state.userCountIncrement())).broadcast();
		}
	}

	enqueue() {
		this.state.enqueueUser(this.socket.id).broadcast();
	}

	dequeue() {
		this.state.dequeueUser(this.socket.id).broadcast();
	}

	sendData(data) {
		if(this.state.rc && !this.state.queue.isEmpty() && this.state.queue.getFirst().id === this.socket.id) {
			this.io.to(this.state.rc.id).emit('rc.data', data);
		}
	}

	disconnect() {
		if (this.state.userExists(this.socket.id)) {
			let user = this.state.userList.get(this.socket.id);
			this.messager.systemMessage(`${user.name} has left`);
			this.state.removeUser(this.socket.id);
		}
		this.state.dequeueUser(this.socket.id).broadcast();
	}
}

module.exports = { UserController };
