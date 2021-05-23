let { config } = require('../config');
let { UserController } = require('./UserController');

const QueueController = {
	enqueue(socket, data) {
		if(!queue.contains(socket.id)) {
			queue.addUser(userList.get(socket.id));

			//Set timer once the number of users exceed the free use limit
			if(queue.size() === config.FREE_USE_CUTOFF + 1) {
				timer.set();
			}
			UserController.updateState({
				queue: queue.getAll(),
				startTime: queue.size() > config.FREE_USE_CUTOFF ? timer.startTime : null,
			});
		}
	},
	dequeue(socket, data) {
		if(queue.contains(socket.id)) {
			if(queue.getFirst().id === socket.id) {
				timer.set();
			}
			queue.remove(socket.id);
			UserController.updateState({
				queue: queue.getAll(),
				startTime: queue.size() > config.FREE_USE_CUTOFF ? timer.startTime : null,
			});
		}
	},
}

module.exports = { QueueController };
