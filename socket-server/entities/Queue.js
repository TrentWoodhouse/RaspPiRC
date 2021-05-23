class Queue {
	constructor() {
		this.queue = [];
	}

	addUser(user) {
		if(user && !this.contains(user.id)) {
			this.queue.push(user);
		}
	}

	remove(id) {
		this.queue = this.queue.filter(user => user.id !== id);
	}

	shift() {
		return this.queue.shift();
	}

	contains(id) {
		return this.queue.filter(user => user.id === id).length > 0;
	}

	getAll() {
		return this.queue;
	}

	getFirst() {
		return this.queue[0] || null;
	}

	size() {
		return this.queue.length;
	}
}

module.exports = { Queue };
