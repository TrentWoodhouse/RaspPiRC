const exec = require('child_process').exec;

class CommandController {
    constructor(socket) {
        this.socket = socket;
    }

    shutdown() {
        console.log('Shutting down...');
        this.socket.disconnect();
        exec('sudo shutdown -h now', (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
        });
    }

    reboot() {
        console.log('Rebooting...');
        this.socket.disconnect();
        exec('sudo reboot', (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
        });
    }
}

module.exports = { CommandController };