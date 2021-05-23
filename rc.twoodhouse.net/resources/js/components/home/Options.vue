<template>
    <div class="bottom-right m-3 text-light">
        <span v-b-modal.options-modal><i class="fa fa-cog fa-2x"></i></span>
    </div>
</template>

<script>
	export default {
		name: "Options",
	}
</script>

<style scoped>
    .bottom-right {
        position: absolute;
        right: 0;
        bottom: 0;
    }
</style>
