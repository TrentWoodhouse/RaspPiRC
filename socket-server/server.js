let express = require('express');
let app = express();
let server = require('http').createServer(app);
let { UserController } = require('./controllers/UserController');
let { RcController } = require('./controllers/RcController');
let { Messenger } = require('./entities/Messager');
let { State } = require('./entities/State');
let { config } = require('./config');

server.listen(config.PORT);
console.log("Server started on port " + config.PORT);

let io = require('socket.io')(server);

const state = new State();

io.on('connection', (socket) => {
    console.log('New Connection');
    state.broadcastInit(socket);

    let messenger = new Messenger(socket);
    let userController;
    let rcController;


    socket.on('message.post', message => messenger.message(message));
    socket.on('user.join', name => {
        userController = new UserController(socket, messenger);
        userController.join(name);
    });
    socket.on('user.send-data', data => userController.sendData(data));
    socket.on('user.enqueue', data => userController.enqueue(data));
    socket.on('user.dequeue', data => userController.dequeue(data));
    socket.on('rc.join', () => {
        rcController = new RcController(socket, messenger);
        rcController.join(name);
    });
    socket.on('disconnect', data => {
        if(rc && socket.id === rc.id) {
            rcController.disconnect();
        }
        else {
            userController.disconnect();
        }
    });
});

module.exports = { io, state };
