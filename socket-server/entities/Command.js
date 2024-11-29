class Command {
    constructor(message) {
        const cmdArray = message.split(/\s+/);

        this.rawMessage = message;
        this.message = message.substr(message.search(/\s+/) + 1)
        this.key = cmdArray[0].substring(1);
        this.args = cmdArray.slice(1);
    }

    static isCommandMessage(message) {
        return message.charAt(0) === '/';
    }
}

module.exports = { Command };
