class Timer {
	constructor(timeLength, callback) {
		this.startTime = Date.now();
		this.timeLength = timeLength;
		this.callback = callback;
		this.timeout = null;
	}

	set() {
		this.startTime = Date.now();
		clearTimeout(this.timeout);
		this.timeout = setTimeout(this._onEnd.bind(this), this.timeLength);
	}

	_onEnd() {
		this.set();
		this.callback();
	}
}

module.exports = { Timer };

