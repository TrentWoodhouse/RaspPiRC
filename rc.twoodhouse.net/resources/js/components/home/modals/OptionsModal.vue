<template>
    <b-modal
        id="options-modal"
        size="l"
        centered
        ok-only
        title="Settings"
    >
        <div class="mb-1">Controls</div>
        <b-button-group class="w-100">
            <b-button
                v-for="_controller in enums.controllers"
                :key="_controller.key"
                @click="controller = _controller"
                :variant="(_controller === controller ? 'primary' : 'outline-primary')">
                <div class="text-center py-4">
                    <i :class="'fa fa-5x ' + _controller.icon"></i>
                    <div>{{ _controller.label }}</div>
                </div>
            </b-button>
        </b-button-group>
        <hr>
        <div class="mb-1">Toggles</div>
        <b-form-checkbox
            id="compact"
            v-model="compact"
            name="compact"
            :value="true"
            :unchecked-value="false"
        >
            Compact
        </b-form-checkbox>
        <b-form-checkbox
            id="hideChat"
            v-model="hideChat"
            name="hideChat"
            :value="true"
            :unchecked-value="false"
        >
            Hide Chat
        </b-form-checkbox>
    </b-modal>
</template>

<script>
    import enums from "../../../enums";
	export default {
		name: "OptionsModal",
        data() {
		    return {
		        enums
            }
        },
        computed: {
            controller: {
                get() {
                    return this.$store.state.settings.controller;
                },
                set(val) {
                    this.$store.commit('updateSettings', { controller: val });
                }
            },
            compact: {
                get() {
                    return this.$store.state.settings.compact;
                },
                set(val) {
                    this.$store.commit('updateSettings', { compact: val });
                }
            },
            hideChat: {
                get() {
                    return this.$store.state.settings.hideChat;
                },
                set(val) {
                    this.$store.commit('updateSettings', { hideChat: val });
                }
            },
        }
	}
</script>

<style scoped>

</style>
