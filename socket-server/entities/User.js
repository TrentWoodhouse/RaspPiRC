class User {
	static counter = 0;
	constructor(id, name) {
		this.id = id;
		this.colorCode = User.counter++;
		this.name = name;
	}
}

module.exports = { User };
