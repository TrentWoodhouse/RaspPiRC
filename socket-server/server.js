let express = require('express');
let app = express();
let server = require('http').createServer(app);
let { UserController, MessageController, QueueController, RcController } = require('./controllers');
let { Queue, Timer } = require('./entities');
let { config } = require('./config');

server.listen(config.PORT);
console.log("Server started on port " + config.PORT);

global.io = require('socket.io')(server);
global.path = require('path');
global.RC = null;
global.userList = new Map();
global.userInc = 0;
global.queue = new Queue();
global.timer = new Timer(config.CONTROL_TIME, () => {
    if(queue.size() > config.FREE_USE_CUTOFF) {
        queue.shift();
        UserController.updateState({
            queue: queue.getAll(),
            startTime: queue.size() > config.FREE_USE_CUTOFF ? timer.startTime : null,
        });
    }
});

io.on('connection', (socket) => {
    console.log('New Connection');
    UserController.updateState({
        rc: RC,
        queue: queue.getAll(),
        startTime: queue.size() > config.FREE_USE_CUTOFF ? timer.startTime : null,
        timeLength: timer.timeLength,
        size: userList.size,
    });

    // socket.on('main.video', frame => socket.broadcast.emit('video', frame));
    socket.on('message.post', data => MessageController.message(socket, data));
    socket.on('user.join', data => UserController.join(socket, data));
    socket.on('rc.join', () => RcController.join(socket));
    socket.on('rc.data', data => RcController.data(socket, data));
    socket.on('queue.enqueue', data => QueueController.enqueue(socket, data));
    socket.on('queue.dequeue', data => QueueController.dequeue(socket, data));
    socket.on('disconnect', data => {
        if(RC && socket.id === RC.id) {
            RcController.disconnect(socket, data);
        }
        else {
            UserController.disconnect(socket, data);
        }
    });
});
