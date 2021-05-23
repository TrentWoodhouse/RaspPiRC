const config = require('./config');
const io = require('socket.io-client');
// const MjpegCamera = require('mjpeg-camera');

console.log('RC car started. Connecting to socket.io server...');

const socket = io(`${config.HOST}:${config.PORT}`);

// const camera = new MjpegCamera({
//     url: 'http://localhost/stream/video.mjpeg'
// })

socket.on('connect', () => {
    socket.emit('rc.join');
    console.log('Connected to server');

    // camera.on('data', frame => {
    //     socket.emit('main.video', frame.data.toString('base64'));
    // })
});

socket.on('rc.data', (data) => {
    console.log(data); //TODO handle data
});

socket.on('disconnect', () => {
    console.log('Disconnected');
});

socket.on("connect_error", (err) => {
    console.log(`Connection error: ${err.message}`);
});