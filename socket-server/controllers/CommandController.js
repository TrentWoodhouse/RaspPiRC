const { insults } = require('../insults');
const sha256 = require('crypto-js/sha256');

class CommandController {
    constructor(io, socket, state, messenger) {
        this.__io = io;
        this.__socket = socket;
        this.__state = state;
        this.__messenger = messenger;
        this.__attemptCounter = 0;
        this.__commands = {
            login: {
                execute: this.__login.bind(this),
                validate: (command) => {
                    if (command.args.length === 0) return "Login requires a password";
                    if (this.__state.userExists(this.__socket.id) 
                        && this.__state.userList.get(this.__socket.id).isAdmin) {
                        return "You are already logged in";
                    }
                    return null;
                },
                needsAuth: false
            },
            logout: {
                execute: this.__logout.bind(this),
                validate: (command) => command.args.length !== 0
                    ? "Logout doesn't accept any arguments"
                    : null,
            },
            shutdown: {
                execute: this.__shutdown.bind(this),
                validate: (command) => {
                    if (command.args.length !== 0) return "Shutdown doesn't accept any arguments";
                    if (!this.__rcConnected()) return "RC car isn't connected";
                    return null;
                },
            },
            reboot: {
                execute: this.__reboot.bind(this),
                validate: (command) => {
                    if (command.args.length !== 0) return "Reboot doesn't accept any arguments";
                    if (!this.__rcConnected()) return "RC car isn't connected";
                    return null;
                },
            },
            announce: {
                execute: this.__announce.bind(this),
                validate: (command) => command.message.length === 0
                    ? "Announcement message is required"
                    : null,
            },
        }
    }

    __hasCommand(command) {
        return this.__commands.hasOwnProperty(command.key)
    }

    __hasPermission(command) {
        return this.__commands[command.key]?.needsAuth ?? true
            ? this.__state.userList.get(this.__socket.id).isAdmin
            : true
    }

    __executeCommand(command) {
        this.__commands[command.key].execute(command)
    }

    __validate(command) {
        return this.__commands[command.key]?.validate(command) ?? null
    }

    __rcConnected() {
        if(this.__state.rc) return true;
=    }

    run(command) {
        if (!command) return;

        if (!this.__hasCommand(command)) {
            this.__messenger.systemMessage(`'${command.key}' is not a valid command`, {to: 'self', log: false});
            return;
        }

        if (!this.__hasPermission(command)) {
            this.__messenger.systemMessage('You do not have permission to run this command', {to: 'self', log: false});
            return;
        }

        let errorMsg = this.__validate(command)
        if (errorMsg) {
            this.__messenger.systemMessage(`Couldn't run "/${command.key}": ${errorMsg}`, {to: 'self', log: false});
            return;
        }

        this.__executeCommand(command)
    }

    __login(command) {
        if(sha256(command.message).toString() === process.env.LOGIN_PASS_ENCRYPTED) {
            if(this.__state.userExists(this.__socket.id)) {
                this.__state.userList.get(this.__socket.id).isAdmin = true;

                this.__messenger.systemMessage('Logged in', {to: 'self', log: false});
            }
        }
        else {
            this.__attemptCounter++;
            if(this.__attemptCounter < 5) {
                this.__messenger.systemMessage('Invalid password', {to: 'self', log: false});

            }
            else if (this.__attemptCounter < 5 + insults.length) {
                this.__messenger.systemMessage(`Invalid password ${insults[this.__attemptCounter - 5]}`, {to: 'self', log: false});
            }
            else {
                this.io.to(this.__socket.id).emit('user.command', {command: 'redirect', args: ['https://www.youtube.com/watch?v=ezrWznE4JMw']});
            }
        }
    }

    __logout() {
        if (this.__state.userExists(this.__socket.id)) {
            let user = this.__state.userList.get(this.__socket.id);
            user.isAdmin = false;
            this.__messenger.systemMessage('Logged out', {to: 'self', log: false});
        }
    }

    __shutdown() {
        this.__io.to(this.__state.rc.id).emit('rc.command', {command: 'shutdown'});
    }

    __reboot() {
        this.__io.to(this.__state.rc.id).emit('rc.command', {command: 'reboot'});
    }

    __announce(command) {
        this.__messenger.announce(command.message);
    }
}

module.exports = { CommandController };