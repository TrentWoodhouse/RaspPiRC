<template>
    <div @click="toggleControls()" class="bottom-right m-3 text-light">
        <i id="icon" :class="'fa fa-2x ' + controller.icon"></i>
        <b-tooltip target="icon">
            Control with {{ controller.label }}
        </b-tooltip>
    </div>
</template>

<script>
    import enums from '../../enums';
	export default {
		name: "ControllerSelection",
        computed: {
            controller() {
                return this.$store.state.controller;
            }
        },
        methods: {
            toggleControls() {
                switch(this.controller.key) {
                    case enums.controllers.KEY.key:
                        this.$store.commit('update', {controller: enums.controllers.TOUCH})
                        break;
                    case enums.controllers.TOUCH.key:
                        this.$store.commit('update', {controller: enums.controllers.GAME})
                        break;
                    case enums.controllers.GAME.key:
                        this.$store.commit('update', {controller: enums.controllers.KEY})
                        break;
                }
            }
        }
	}
</script>

<style scoped>
    .bottom-right {
        position: absolute;
        right: 0;
        bottom: 0;
    }
</style>
