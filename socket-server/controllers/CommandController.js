const { insults } = require('../insults');
const sha256 = require('crypto-js/sha256');
const { config } = require('../config');

class CommandController {
    constructor(io, socket, state, messenger) {
        this.io = io;
        this.socket = socket;
        this.state = state;
        this.messenger = messenger;
        this.attemptCounter = 0;
        this.commands = {
            login: this.login.bind(this),
            logout: this.logout.bind(this),
            shutdown: this.shutdown.bind(this),
            reboot: this.reboot.bind(this),
            announce: this.announce.bind(this),
        }
    }

    isCommand(message) {
        return message.charAt(0) === '/';
    }
    
	getArgs(message) {
		if (this.isCommand(message)) {
            return message.substr(1).split(/\s+/);
		}
	}

    hasPermission() {
        if(this.state.userList.get(this.socket.id).isAdmin) return true;
        this.messenger.systemMessage('You do not have permission to execute this command', {to: 'self', log: false});
        return false;
    }

    rcConnected() {
        if(this.state.rc) return true;
        this.messenger.systemMessage('No RC car connected', {to: 'self', log: false});
    }

    run(command) {
        let args = this.getArgs(command);
        if(this.commands.hasOwnProperty(args[0])) {
            let arg0 = args.shift();
            this.commands[arg0](...args);
        }
        else {
            this.messenger.systemMessage(`'${args[0]}' is not a valid command`, {to: 'self', log: false});
        }
    }

    login(password) {
        if(sha256(password).toString() === config.LOGIN_PASS_ENCRYPTED) {
            if(this.state.userExists(this.socket.id)) {
                this.state.userList.get(this.socket.id).isAdmin = true;
                this.messenger.systemMessage('Logged in', {to: 'self', log: false});
            }
        }
        else {
            this.attemptCounter++;
            if(this.attemptCounter < 5) {
                this.messenger.systemMessage('Invalid password', {to: 'self', log: false});

            }
            else if (this.attemptCounter < 5 + insults.length) {
                this.messenger.systemMessage(`Invalid password ${insults[this.attemptCounter - 5]}`, {to: 'self', log: false});
            }
            else {
                this.io.to(this.socket.id).emit('user.command', {command: 'redirect', args: ['https://www.youtube.com/watch?v=ezrWznE4JMw']});
            }
        }
    }

    logout() {
        let user = this.state.userList.get(this.socket.id);
        if(user.isAdmin) {
            user.isAdmin = false;
            this.messenger.systemMessage('Logged out', {to: 'self', log: false});
        }
    }

    shutdown() {
        if(this.hasPermission() && this.rcConnected()) {
            this.io.to(this.state.rc.id).emit('rc.command', {command: 'shutdown'});
        }
    }

    reboot() {
        if(this.hasPermission() && this.rcConnected()) {
            this.io.to(this.state.rc.id).emit('rc.command', {command: 'reboot'});
        }
    }

    announce(...args) {
        if(this.hasPermission()) {
            this.messenger.announce(args.join(' '));
        }
    }
}

module.exports = { CommandController };