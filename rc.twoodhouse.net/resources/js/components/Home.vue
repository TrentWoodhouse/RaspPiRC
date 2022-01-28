<template>
    <div class="home overflow-hidden w-100 h-100">
        <Controls/>
        <Video/>
        <Status/>
        <TitleBar/>
        <Queue/>
        <Chat/>
        <NameModal/>
        <ControllerSelection/>
    </div>
</template>

<script>
    import TitleBar from "./home/TitleBar";
    import Status from "./home/Status";
    import Chat from "./home/Chat"
    import Queue from "./home/Queue";
    import NameModal from "./home/modals/NameModal";
    import Video from "./home/Video";
    import ControllerSelection from "./home/ControllerSelection";
    import Controls from "./home/Controls";
	export default {
		name: "Home",
        components: {
            Controls,
		    ControllerSelection,
            NameModal,
            Queue,
		    TitleBar,
            Status,
            Chat,
            Video,
        },
        mounted() {
		    this.updateWindowDimensions();
            window.addEventListener('resize', this.updateWindowDimensions);
        },
        destroyed() {
            window.removeEventListener('resize', this.updateWindowDimensions);
        },
        sockets: {
		    connect() {
		        this.$store.commit('update', { socketId: this.$socket.id });
            },
            'user.command'({command, args}) {
                switch (command) {
                    case 'redirect':
                        window.location.href = args[0];
                        break;
                }
            },
            disconnect() {
                this.$store.commit('update', {
                    socketId: null,
                    rc: null,
                    queue: [],
                    startTime: null,
                    timeLength: null,
                });
                this.$store.commit('addMessage', {
                    isAnnouncement: true,
                    message: "Network connection lost. Reconnecting...",
                });
            },
            'main.update-state'(data) {
		        this.$store.commit('update', data);
            },
        },
        methods: {
            updateWindowDimensions() {
                this.$store.commit('update', {
                    windowHeight: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
                    windowWidth: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
                })
            }
        }
	}
</script>

<style>
    .no-select {
        user-select: none; /* supported by Chrome and Opera */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
    }

    .dark-background {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .home {
        background-color: #1a1a1d;
    }
</style>
