class TouchscreenController {
    constructor(domElement, fps, radius, callback) {
        //Set passed in values
        this.domElement = domElement;
        this.fps = fps;
        this.radius = radius;
        this.callback = callback;

        //Watch mouse values
        this._mouseStartX = 0;
        this._mouseStartY = 0;
        this._mouseX = 0;
        this._mouseY = 0;
        this._mouseDown = false;

        //Remove tabindex
        if (this.domElement !== document) {
            this.domElement.setAttribute('tabindex', -1);
        }

        //Set event functions
        this._onMouseDown = this._onMouseDownEvent.bind(this);
        this._onMouseUp = this._onMouseUpEvent.bind(this);
        this._onMouseMove = this._onMouseMoveEvent.bind(this);
    }

    start() {
        this.domElement.addEventListener( 'mousedown', this._onMouseDown, false );
        this.domElement.addEventListener( 'mouseup', this._onMouseUp, false );
        this.domElement.addEventListener( 'mousemove', this._onMouseMove, false );
        this.interval = setInterval(() => {
            this._processData();
        }, 1000 / this.fps);
    };

    stop() {
        this.domElement.removeEventListener( 'mousedown', this._onMouseDown, false );
        this.domElement.removeEventListener( 'mouseup', this._onMouseUp, false );
        this.domElement.removeEventListener( 'mouseup', this._onMouseMove, false );
        clearInterval(this.interval);
        this._mouseStartX = 0;
        this._mouseStartY = 0;
        this._mouseX = 0;
        this._mouseY = 0;
        this._mouseDown = false;
    };

    _processData() {
        let x = this._mouseX - this._mouseStartX;
        let y = this._mouseY - this._mouseStartY;

        this.callback({
            speed: Math.max(Math.min(-y / this.radius, 1), -1),
            turn: Math.max(Math.min(x / this.radius, 1), -1),
        });
    }

    _onMouseDownEvent( event ) {
        this._mouseStartX = event.clientX;
        this._mouseStartY = event.clientY;
        this._mouseX = event.clientX;
        this._mouseY = event.clientY;
        this._mouseDown = true;
    };

    _onMouseUpEvent( event ) {
        this._mouseStartX = 0;
        this._mouseStartY = 0;
        this._mouseX = 0;
        this._mouseY = 0;
        this._mouseDown = false;
    };

    _onMouseMoveEvent( event ) {
        if(this._mouseDown) {
            this._mouseX = event.clientX;
            this._mouseY = event.clientY;
        }
    }
}

module.exports = { TouchscreenController };
