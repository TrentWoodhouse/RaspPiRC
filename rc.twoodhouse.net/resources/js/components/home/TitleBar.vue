<template>
    <div class="top-left no-select m-3 text-light">
        <h1 class="d-inline">
            <a target="_blank" href="http://www.twoodhouse.net">
                <img src="../../../img/TWLogo.svg">
            </a>
            <div class="d-inline">
                <div class="d-none d-lg-inline">Raspberry Pi RC Car</div>
                <div class="d-inline d-lg-none">RPI RC Car</div>
            </div>
        </h1>
    </div>
</template>

<script>
	export default {
		name: "TitleBar",
	}
</script>

<style scoped>
    .top-left {
        position:absolute;
        top:0;
        left:0;
    }
</style>
