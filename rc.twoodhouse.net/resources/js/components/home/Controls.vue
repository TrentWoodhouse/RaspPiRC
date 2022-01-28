<template>
    <canvas id="canvas"/>
</template>

<script>
    import enums from '../../enums';
	import config from "../../config";
    import { KeyboardController } from "../../controllers/KeyboardController";
    import { TouchscreenController } from "../../controllers/TouchscreenController";

    export default {
		name: "Controls",
        data() {
		    return {
                ctx: null,
                keyboard: null,
                touchscreen: null,
            }
        },
        computed: {
		    rc() {
		        return this.$store.state.rc;
            },
            rcIsConnected() {
                return this.$store.getters.rcIsConnected;
            },
            inControl() {
                return this.$store.getters.inControl;
            },
            isDriving() {
		        return this.rcIsConnected && this.inControl && this.controls;
            },
            isMobile() {
		        return this.$store.state.isMobile;
            },
            windowHeight() {
                return this.$store.state.windowHeight;
            },
            windowWidth() {
                return this.$store.state.windowWidth;
            },
            controls() {
                switch(this.$store.state.controller.key) {
                    case enums.controllers.KEY.key:
                        return this.keyboard;
                    case enums.controllers.TOUCH.key:
                        return this.touchscreen;
                    case enums.controllers.GAME.key:
                        return this.keyboard; //TODO add game controller
                }
            }
        },
        mounted() {
            let video = document.getElementById('video');
            let canvas = document.getElementById('canvas');
            this.ctx = canvas.getContext('2d');
		    this.updateDimensions();
            this.keyboard = new KeyboardController(video, config.FPS, (data) => {
                this.$socket.emit('user.send-data', data);
            });
            this.touchscreen = new TouchscreenController(video, canvas, config.FPS, 40, (data) => {
                this.$socket.emit('user.send-data', data);
            });
        },
        watch: {
		    isDriving(val) {
		        if(val) {
                    this.controls?.start();
                }
		        else {
		            this.controls?.stop();
                }
            },
            controls(nval, oval) {
                if(this.isDriving) {
                    oval?.stop();
                    nval?.start();
                }
            },
            windowHeight(val) {
                this.updateDimensions();
            },
            windowWidth(val) {
                this.updateDimensions();
            }
        },
        methods: {
            updateDimensions() {
                this.ctx.canvas.width = this.windowWidth;
                this.ctx.canvas.height = this.windowHeight;
            }
        }
	}
</script>

<style scoped>
    canvas {
        pointer-events: none;
        position: absolute;
        z-index: 1000;
    }
</style>
