class CommandController {
    validList = {
        login: 2,
        shutdown: 1,
        reboot: 1,
        announce: 'many',
    }

	isValidCommand(socket, message) {
		if (message.charAt(0) === '/' && userList.has(socket.id)) {
			let user = userList.get(socket.id);
            let args = message.substr(1).split(/\s+/);
            return validList[args[0]] === args.length || validList[args[0]] === 'many';
		}
	}

    run(command) {

    }

    login(password) {

    }

    shutdown() {

    }

    reboot() {

    }

    announce(...args) {

    }
}

module.exports = { CommandController };