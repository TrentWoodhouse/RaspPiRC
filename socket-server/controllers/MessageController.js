const MessageController = {
	message(socket, data) {
		if (userList.has(socket.id)) {
			let user = userList.get(socket.id);
			console.log(user.name + ": " + data.message);
			io.emit('message.post', {
				message: data.message,
				name: user.name,
				colorCode: user.colorCode,
				isAnnouncement: false,
			});
		}
	},
}

module.exports = { MessageController };
