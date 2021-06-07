let express = require('express');
let app = express();
let server = require('http').createServer(app);
let { UserController } = require('./controllers/UserController');
let { RcController } = require('./controllers/RcController');
let { Messenger } = require('./entities/Messenger');
let { State } = require('./entities/State');
let { config } = require('./config');

server.listen(config.PORT);
console.log("Server started on port " + config.PORT);

let io = require('socket.io')(server);
const state = new State(io);

io.on('connection', (socket) => {
    console.log('New Connection');
    state.broadcastInit(socket);

    const messenger = new Messenger(io, socket, state);
    let controller;

    socket.on('message.post', message => messenger.message(message));
    socket.on('user.join', name => {
        controller = new UserController(io, socket, state, messenger);
        controller.join(name);
    });
    socket.on('user.send-data', data => controller.sendData(data));
    socket.on('user.enqueue', data => controller.enqueue(data));
    socket.on('user.dequeue', data => controller.dequeue(data));
    socket.on('rc.join', () => {
        controller = new RcController(socket, state, messenger);
        controller.join();
    });
    socket.on('disconnect', () => {
        controller.disconnect();
    });
});