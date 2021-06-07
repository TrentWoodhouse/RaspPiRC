<template>
    <b-modal
        centered
        no-close-on-esc
        no-close-on-backdrop
        v-model="modalShow"
        title="Welcome"
    >
        <p>Enter your display name:</p>
        <input class="form-control" v-model="name" maxlength="20" type="text" @keyup.enter="joinAs(name)">
        <template v-slot:modal-footer>
            <b-button @click="joinAs(null)" variant="secondary">Remain Anonymous</b-button>
            <b-button @click="joinAs(name)" :disabled="!name" variant="primary">Save Name</b-button>
        </template>
        <template v-slot:modal-header-close>
            <span @click="joinAs(null)">&times;</span>
        </template>
    </b-modal>
</template>

<script>
	import randomAnimal from "../../../animals";
	import randomWord from "../../../random";
    import config from "../../../config";

    export default {
		name: "NameModal",
        data() {
		    return {
		        nameProxy: '',
            }
        },
        computed: {
		    name: {
		        get() {
		            let storeName = this.$store.state.name;
		            return storeName ? storeName : this.nameProxy;
                },
                set(val) {
		            this.nameProxy = val;
                }
            },
            modalShow: {
		        get() {
                    return !this.$store.state.name;
                },
                set() {
		            //welp
                }
            },
        },
        sockets: {
		    connect() {
                if(!this.modalShow) {
                    this.joinAs(this.name);
                }
            },
        },
        methods: {
            joinAs(name) {
                let _name = name;
                if(!_name) {
                    let end = '';
                    switch(config.ANON) {
                        case 'animal':
                            end = randomAnimal();
                            break;
                        default:
                            end = randomWord();
                            break;
                    }

                    _name = 'Anonymous ' + end;
                }
                this.$store.commit('update', { name: _name })
                this.$socket.emit('user.join', _name);
                $('#modal').modal('hide');
            },
        }
	}
</script>

<style scoped>

</style>
