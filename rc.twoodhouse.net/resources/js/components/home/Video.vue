<template>
    <div id="video">
        <img
            v-if="rcIsConnected"
            :src="`http://${ rc.ip }:8080/stream/video.mjpeg`"
            :width="windowWidth"
            :height="windowHeight"
            draggable="false"
        />
    </div>

<!--    <img-->
<!--        id="video"-->
<!--        v-if="rcIsConnected"-->
<!--        :src="src"-->
<!--        :width="windowWidth"-->
<!--        :height="windowHeight"-->
<!--    />-->
</template>

<script>
	import config from "../../config";
    import { KeyboardController } from "../../controllers/KeyboardController";
    import { TouchscreenController } from "../../controllers/TouchscreenController";

    export default {
		name: "Video",
        data() {
		    return {
                controller: null,
                // src: null,
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
		        return this.rcIsConnected && this.inControl && this.controller;
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
        },
        watch: {
		    isDriving(val) {
		        if(val) {
                    this.controller.start();
                }
		        else {
		            this.controller.stop();
                }

            }
        },
        mounted() {
            this.controller = !this.isMobile ?
                new KeyboardController(document, config.FPS, (data) => {
                    this.$socket.emit('rc.data', data);
                }) :
                new TouchscreenController(document.getElementById('video'), config.FPS, 50, (data) => {
                    this.$socket.emit('rc.data', data);
                })
        },
        // sockets: {
		//     'main.video'(frame) {
		//         this.src = 'data:image/jpg;base64,' + frame;
        //     }
        // }
	}
</script>

<style scoped>
    img {
        object-fit: cover;
    }
</style>
