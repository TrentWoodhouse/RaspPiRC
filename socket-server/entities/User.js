class User {
	constructor(id, name, colorCode) {
		this.id = id;
		this.name = name;
		this.colorCode = colorCode;
		this.isAdmin = false;
	}
}

module.exports = { User };
