class User {
	constructor(id, name) {
		this.id = id;
		this.colorCode = userInc++;
		this.name = name;
		this.isAdmin = false;
	}
}

module.exports = { User };
