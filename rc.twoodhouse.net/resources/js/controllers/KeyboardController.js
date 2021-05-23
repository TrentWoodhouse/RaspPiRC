class KeyboardController {
    constructor(domElement, fps, callback) {
        //Set passed in values
        this.domElement = domElement;
        this.fps = fps;
        this.callback = callback;

        //Keys to watch
        this._upKey = false;
        this._downKey = false;
        this._rightKey = false;
        this._leftKey = false;

        //Remove tabindex
        if (this.domElement !== document) {
            this.domElement.setAttribute( 'tabindex', -1);
        }

        //Set event functions
        this._onKeyDown = this._onKeyDownEvent.bind(this);
        this._onKeyUp = this._onKeyUpEvent.bind(this);

        //Set data buffers
        this._speedBuffer = new Array(fps).fill(0);
        this._turnBuffer = new Array(fps).fill(0);
    }

    start() {
        this.domElement.addEventListener( 'keydown', this._onKeyDown, false );
        this.domElement.addEventListener( 'keyup', this._onKeyUp, false );
        this.interval = setInterval(() => {
            this._processData();
        }, 1000 / this.fps);
    };

    stop() {
        this.domElement.removeEventListener( 'keydown', this._onKeyDown, false );
        this.domElement.removeEventListener( 'keyup', this._onKeyUp, false );
        clearInterval(this.interval);
        this._speedBuffer = new Array(this.fps).fill(0);
        this._turnBuffer = new Array(this.fps).fill(0);
    };

    _processData() {
        this._speedBuffer.shift();
        this._turnBuffer.shift();
        this._speedBuffer.push((this._upKey ? 1 : 0) + (this._downKey ? -1 : 0));
        this._turnBuffer.push((this._rightKey ? 1 : 0) + (this._leftKey ? -1 : 0));

        let avgSpeed = 0;
        let avgTurn = 0;
        for(let i = 0; i < this.fps; i++) {
            avgSpeed += this._speedBuffer[i];
            avgTurn += this._turnBuffer[i];
        }

        this.callback({
            speed: avgSpeed / this.fps,
            turn: avgTurn / this.fps,
        });
    }

    _onKeyDownEvent( event ) {
        switch ( event.keyCode ) {
            case 38: /*up*/
            case 87: /*W*/ this._upKey = true; break;

            case 37: /*left*/
            case 65: /*A*/ this._leftKey = true; break;

            case 40: /*down*/
            case 83: /*S*/ this._downKey = true; break;

            case 39: /*right*/
            case 68: /*D*/ this._rightKey = true; break;
        }
    };

    _onKeyUpEvent( event ) {
        switch ( event.keyCode ) {
            case 38: /*up*/
            case 87: /*W*/ this._upKey = false; break;

            case 37: /*left*/
            case 65: /*A*/ this._leftKey = false; break;

            case 40: /*down*/
            case 83: /*S*/ this._downKey = false; break;

            case 39: /*right*/
            case 68: /*D*/ this._rightKey = false; break;
        }
    };
}

module.exports = { KeyboardController };
