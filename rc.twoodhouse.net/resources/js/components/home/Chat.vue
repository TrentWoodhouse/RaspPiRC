<template>
    <div class="d-flex flex-row align-items-end bottom-left p-3 text-light">
        <div
            v-if="!hideChat"
            :class="{'dark-background': rcIsConnected, rounded: rcIsConnected}"
        >
            <div v-for="(message, index) in messages" :key="index" class="messages-item">
                <div v-if="message.type === 'message'">
                    <span :class="color(message.colorCode)">{{ message.name }}:</span> {{ message.text }}
                </div>
                <div v-else-if="message.type === 'system'" class="text-secondary">
                    <i>{{ message.text }}</i>
                </div>
                <div v-else-if="message.type === 'notification'">
                    <i class="text-yellow">[ANNOUNCEMENT] {{ message.text }}</i>
                </div>
            </div>
            <div class="no-select">
                <input
                    v-if="!windowNeedsRotated"
                    type="text"
                    class="dark-box"
                    v-model="text" :maxlength="50"
                    @keyup.enter="sendChat()"
                    @focus="focused = true"
                    @blur="focused = false"
                    placeholder="Send a message..."
                >
            </div>
        </div>
        <b-link class="text-light" :class="{'ml-1': !hideChat}" @click="$store.commit('updateSettings', { hideChat: !hideChat })">
            <i class="fa fa-2x" :class="{'fa-caret-left': !hideChat, 'fa-caret-right': hideChat}"></i>
        </b-link>
    </div>
</template>

<script>
	export default {
		name: "Chat",
        data() {
            return {
                text: '',
                messageAllowed: true,
                focused: false,
            }
        },
        computed: {
		    messages() {
                return this.$store.state.messages.slice(-(Math.max(Math.round(Math.min(this.windowHeight, this.windowWidth) / 46) - 2, 4)));
            },
            compact() {
		        return this.$store.state.settings.compact;
            },
            windowNeedsRotated() {
                return this.$store.getters.windowNeedsRotated;
            },
            windowHeight() {
		        return this.$store.state.windowHeight;
            },
            windowWidth() {
		        return this.$store.state.windowWidth;
            },
            hideChat() {
                return this.$store.state.settings.hideChat;
            },
            rcIsConnected() {
                return this.$store.getters.rcIsConnected;
            },
        },
        sockets: {
            'message.post'(message) {
                this.$store.commit('addMessage', message);
            },
        },
        methods: {
            sendChat() {
                if(this.text.trim() !== '' && this.messageAllowed) {
                    this.$socket.emit('message.post', this.text);
                    this.text = '';
                    this.messageAllowed = false;
                    setTimeout(() => {
                        this.messageAllowed = true;
                    }, 200, this);
                }
            },
            color(colorCode) {
                let cc = colorCode % 6;
                switch(cc) {
                    case 0:
                        return 'text-red';
                    case 1:
                        return 'text-orange';
                    case 2:
                        return 'text-yellow';
                    case 3:
                        return 'text-green';
                    case 4:
                        return 'text-blue';
                    case 5:
                        return 'text-purple';
                }
            },
        },
	}
</script>

<style scoped>
    .bottom-left {
        position: absolute;
        left: 0;
        bottom: 0;
    }

    input[type=text].dark-box {
        width: 400px;
        background-color: rgba(0, 0, 0, 0.5);
        box-sizing: content-box;
        border: none;
        color: white;
        outline: none;
    }

    ::-webkit-input-placeholder {
        font-style: italic;
    }
    :-moz-placeholder {
        font-style: italic;
    }
    ::-moz-placeholder {
        font-style: italic;
    }
    :-ms-input-placeholder {
        font-style: italic;
    }
</style>
