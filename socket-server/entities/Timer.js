class Timer {
	constructor(timeLength, callback) {
		this.startTime = null;
		this.timeLength = timeLength;
		this.callback = callback;
		this.timeout = null;
	}

	start() {
		this.startTime = Date.now();
		clearTimeout(this.timeout);
		this.timeout = setTimeout(this._onEnd.bind(this), this.timeLength);
	}

	stop() {
		this.startTime = null;
		clearTimeout(this.timeout);
	}

	isRunning() {
		return !!this.startTime;
	}

	stopTime() {
		return this.startTime ? this.startTime + this.timeLength : null;
	}

	_onEnd() {
		this.stop();
		this.callback(this);
	}
}

module.exports = { Timer };

