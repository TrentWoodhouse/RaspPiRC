const { Timer } = require('./Timer');
const { Queue } = require('./Queue');
const { config } = require('../config');
const { io } = require('../server');

class State {
    constructor() {
        this.rc = null;
        this.userList = new Map();
        this.queue = new Queue();
        this.timer = new Timer(config.CONTROL_TIME, () => {
            this.dequeueUser(this.queue.getFirst().id).broadcast();
        });
        this.changes = {};
    }

    setRc(rc) {
        this.rc = rc;
        this.changes.rc = rc;
        return this;
    }

    addUser(user) {
        this.userList.set(user.id, user);
        this.changes.size = this.userList.size;
        return this;
    }

    removeUser(userId) {
        this.userList.delete(userId);
        this.changes.size = this.userList.size;
        return this;
    }

    enqueueUser(userId) {
        if(!this.queue.contains(userId)) {
            this.queue.addUser(this.userList.get(userId));

            if(this.queue.size() > config.FREE_USE_CUTOFF && !this.timer.isRunning()) {
                this.timer.start();
            }

            this.changes.queue = this.queue.getAll();
            this.changes.stopTime = this.timer.stopTime();
        }
        return this;
    }

    dequeueUser(userId) {
        if(this.queue.contains(userId)) {
			if(this.queue.size() <= config.FREE_USE_CUTOFF + 1) {
				this.timer.stop();
                this.changes.stopTime = this.timer.stopTime();
			}
            else if(this.queue.getFirst().id === userId) {
				this.timer.start();
                this.changes.stopTime = this.timer.stopTime();
			}

            this.queue.remove(userId);
            this.changes.queue = this.queue.getAll();
        }
        return this;
    }

    userExists(userId) {
        return this.userList.has(userId);
    }

    broadcast() {
        if(Object.keys(changes).length !== 0) {
            io.emit('main.update-state', this.changes);
            this.changes = {};            
        }
    }

    broadcastInit(socket) {
        socket.emit('main.update-state', {
            rc: this.rc,
            queue: this.queue.getAll(),
            stopTime: this.timer.stopTime(),
            size: this.userList.size,
        });
    }
}

module.exports = { State };