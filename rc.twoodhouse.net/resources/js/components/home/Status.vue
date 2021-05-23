<template>
    <div>
        <div v-if="windowNeedsRotated" class="text-center center no-select text-light">
            <i class="fa fa-sync-alt fa-5x"></i>
            <div class="mt-2">Please rotate your device</div>
        </div>
        <div v-else>
            <div v-if="!(isConnected && rcIsConnected)">
                <img class="center no-select" src="../../../img/JeepIcon.png">
            </div>
            <div v-if="!isConnected" class="text-center center no-select text-light">
                <div class="spinner-border"></div>
                <div class="mt-2">Connecting...</div>
            </div>
            <div v-else-if="!rcIsConnected" class="text-center center no-select text-light">
                <div><i class="fas fa-exclamation-triangle fa-5x"></i></div>
                <div class="mt-2">RC car is currently unavailable</div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: "Status",
        computed: {
            isConnected() {
                return this.$store.getters.isConnected;
            },
            rcIsConnected() {
                return this.$store.getters.rcIsConnected;
            },
            windowNeedsRotated() {
                return this.$store.getters.windowNeedsRotated;
            }
        },
	}
</script>

<style scoped>
    .center {
        position:absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
