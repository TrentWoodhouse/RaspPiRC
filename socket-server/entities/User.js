class User {
	constructor(id, name) {
		this.id = id;
		this.colorCode = userInc++;
		this.name = name;
	}
}

module.exports = { User };
