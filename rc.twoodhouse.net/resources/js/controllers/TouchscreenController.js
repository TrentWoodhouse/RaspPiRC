class TouchscreenController {
    constructor(domElement, canvas, fps, radius, callback) {
        //Set passed in values
        this.domElement = domElement;
        this.canvas = canvas;
        this.fps = fps;
        this.radius = radius;
        this.callback = callback;

        //Output values
        this.dataX = 0;
        this.dataY = 0;
        this.running = false;

        //Get context
        this._ctx = canvas.getContext('2d');

        //Watch touch values
        this._touchStartX = 0;
        this._touchStartY = 0;
        this._touchX = 0;
        this._touchY = 0;
        this._touchDown = false;

        //Remove tabindex
        if (this.domElement !== document) {
            this.domElement.setAttribute('tabindex', -1);
        }

        //Set event functions
        this._onTouchDown = this._onTouchDownEvent.bind(this);
        this._onTouchUp = this._onTouchUpEvent.bind(this);
        this._onTouchMove = this._onTouchMoveEvent.bind(this);
    }

    start() {
        if(!this.running) {
            this._clear();
            this.running = true;
            this.domElement.addEventListener('touchstart', this._onTouchDown, false );
            this.domElement.addEventListener('touchend', this._onTouchUp, false );
            this.domElement.addEventListener('touchmove', this._onTouchMove, false );
            this.interval = setInterval(() => {
                this._processData();
            }, 1000 / this.fps);
        }
    };

    stop() {
        if(this.running) {
            this._clear();
            this.running = false;
            this.domElement.removeEventListener('touchstart', this._onTouchDown, false );
            this.domElement.removeEventListener('touchend', this._onTouchUp, false );
            this.domElement.removeEventListener('touchmove', this._onTouchMove, false );
            clearInterval(this.interval);
            this._touchStartX = 0;
            this._touchStartY = 0;
            this._touchX = 0;
            this._touchY = 0;
            this._touchDown = false;
        }
    };

    _draw() {
        this._clear();
        this._ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this._ctx.beginPath();
        this._ctx.arc(this._touchStartX, this._touchStartY, this.radius * 1.4, 0, 2 * Math.PI);
        this._ctx.fill();

        let x, y;
        let deltx = this._touchX - this._touchStartX;
        let delty = this._touchY - this._touchStartY;
        if(deltx * deltx + delty * delty > this.radius * this.radius) {
            x = this._touchStartX + this.radius * (deltx / Math.sqrt(deltx * deltx + delty * delty));
            y = this._touchStartY + this.radius * (delty / Math.sqrt(deltx * deltx + delty * delty));
        }
        else {
            x = this._touchX;
            y = this._touchY;
        }

        this._ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this._ctx.beginPath();
        this._ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
        this._ctx.fill();
    }

    _clear() {
        this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    }

    _processData() {
        this.callback({
            speed: Math.max(Math.min(this.dataY, 1), -1),
            turn: Math.max(Math.min(this.dataX, 1), -1),
        });
    }

    _onTouchDownEvent( event ) {
        this._touchStartX = event.touches[0].clientX;
        this._touchStartY = event.touches[0].clientY;
        this._touchX = event.touches[0].clientX;
        this._touchY = event.touches[0].clientY;
        this.dataX = 0;
        this.dataY = 0;
        this._touchDown = true;
        this._draw();
    };

    _onTouchMoveEvent( event ) {
        this._touchX = event.touches[0].clientX;
        this._touchY = event.touches[0].clientY;
        let deltx = this._touchX - this._touchStartX;
        let delty = this._touchY - this._touchStartY;
        let theta = Math.atan2(delty, deltx) || 0;
        let r = Math.min(this.radius, Math.sqrt(deltx * deltx + delty * delty));
        r = Math.min(r / Math.abs(Math.cos(theta)), r / Math.abs(Math.sin(theta)));
        this.dataX = r * Math.cos(theta) / this.radius;
        this.dataY = -r * Math.sin(theta) / this.radius;
        this._draw();
    }
    
    _onTouchUpEvent( event ) {
        this._touchStartX = 0;
        this._touchStartY = 0;
        this._touchX = 0;
        this._touchY = 0;
        this.dataX = 0;
        this.dataY = 0;
        this._touchDown = false;
        this._clear();
    };
}

module.exports = { TouchscreenController };
