const config = require('./config');
const io = require('socket.io-client');
const { CommandController } = require('./CommandController');
// const Gpio = require('pigpio').Gpio;
console.log('RC car started. Connecting to socket.io server...');

const socket = io(`${config.HOST}:${config.PORT}`);
commands = new CommandController(socket);

socket.on('connect', () => {
    socket.emit('rc.join');
    console.log('Connected to server');
});

socket.on('rc.data', data => {
    console.log(data); //TODO handle data
});

socket.on('rc.command', data => {
    commands[data.command](data.args);
})

socket.on('disconnect', () => {
    console.log('Disconnected');
});

socket.on("connect_error", err => {
    console.log(`Connection error: ${err.message}`);
});

// const motorIn = new Gpio(4, {mode: Gpio.INPUT});
// const servoIn = new Gpio(17, {mode: Gpio.INPUT});
// const motorOut = new Gpio(27, {mode: Gpio.OUTPUT});
// const servoOut = new Gpio(22, {mode: Gpio.OUTPUT});

/**
 * TODO
 * Test the following
 * - Basic GPIO functionality (example on pigpio doucmentation)
 * - 3V3 signal works on servo
 * - 3V3 signal works on esc
 * - PowerBoost USB works as intended (nevermind)
 */