let { User } = require('../entities');
let { config } = require('../config');

const UserController = {
	updateState(data) {
		io.emit('main.update-state', data);
	},
	join(socket, data) {
		if(!userList.has(socket.id)) {
			console.log(data.name + ' connected');
			socket.broadcast.emit('message.post', {
				message: data.name + " has joined.",
				isAnnouncement: true,
			});
			socket.emit('message.post', {
				message: "You have joined as " + data.name + ".",
				isAnnouncement: true,
			});
			userList.set(socket.id, new User(socket.id, data.name));
			this.updateState({
				size: userList.size,
			});
		}
	},
	disconnect(socket, data) {
		if (userList.has(socket.id)) {
			let user = userList.get(socket.id);
			console.log(user.name + ' disconnected');
			socket.broadcast.emit('message.post', {
				message: user.name + " has left.",
				isAnnouncement: true,
			});
			userList.delete(socket.id);
			this.updateState({
				size: userList.size,
			});
		}
		if (queue.contains(socket.id)) {
			queue.remove(socket.id);
			this.updateState({
				queue: queue.getAll(),
				startTime: queue.size() > config.FREE_USE_CUTOFF ? timer.startTime : null,
			});
		}
	},
}

module.exports = { UserController };
