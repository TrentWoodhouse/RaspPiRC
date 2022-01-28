<template>
    <div id="video" class="w-100 h-100">
        <img
            v-if="rcIsConnected"
            :src="`http://${ rc.ip }:8080/stream/video.mjpeg`"
            :width="windowWidth"
            :height="windowHeight"
            draggable="false"
        />
    </div>
</template>

<script>
	export default {
		name: "Video",
        computed: {
            rc() {
                return this.$store.state.rc;
            },
            rcIsConnected() {
                return this.$store.getters.rcIsConnected;
            },
            windowHeight() {
                return this.$store.state.windowHeight;
            },
            windowWidth() {
                return this.$store.state.windowWidth;
            },
        },
	}
</script>

<style scoped>
    img {
        object-fit: cover;
    }
</style>
