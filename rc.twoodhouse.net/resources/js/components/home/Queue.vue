<template>
    <div
        v-if="!windowNeedsRotated"
        class="d-flex flex-row top-right no-select p-3 text-light"
        :class="rcIsConnected ? 'dark-background rounded' : null"
    >
        <div><i class="fa fa-eye"></i> {{ size }}</div>
        <div class="d-flex">
            <div class="display-4 d-inline mr-3">{{ time }}</div>
            <div>
                <div class="queue-header">Driving</div>
                <hr class="queue-hr">
                <div v-if="!compact">
                    <div v-for="(user, i) in queue" :key="user.id" class="queue-item">{{ (i + 1) + ". " + user.name }}</div>
                </div>
                <div v-else>
                    <div v-if="!inControl && queue.length > 0" class="queue-item">Waiting on {{ peopleBeforeMe }}...</div>
                    <div v-if="inQueue" class="queue-item">{{ me.name }}</div>
                </div>
                <div v-if="!inQueue" class="link" @click="enqueue()">Join Queue</div>
                <div v-else class="link" @click="dequeue()">Leave Queue</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
		name: "Queue",
        data() {
		    return {
		        time: '',
                interval: null,
            }
        },
        computed: {
		    socketId() {
		        return this.$store.state.socketId;
            },
            startTime() {
                return this.$store.state.startTime;
            },
            timeLength() {
                return this.$store.state.timeLength;
            },
            queue() {
                return this.$store.state.queue;
            },
            inQueue() {
                return this.$store.getters.inQueue;
            },
            inControl() {
                return this.$store.getters.inControl;
            },
            compact() {
                return this.$store.state.settings.compact;
            },
            me() {
		        return this.queue.filter(user => this.socketId === user.id)[0];
            },
            peopleBeforeMe() {
                return this.inQueue ? this.queue.indexOf(this.me) : this.queue.length;
            },
            windowNeedsRotated() {
                return this.$store.getters.windowNeedsRotated;
            },
            rcIsConnected() {
                return this.$store.getters.rcIsConnected;
            },
            size() {
		        return this.$store.state.size;
            }
        },
        created() {
            this.interval = setInterval(() => {
                this.updateTime();
            }, 100);
        },
        destroyed() {
		    clearInterval(this.interval);
        },
        methods: {
            enqueue() {
                this.$socket.emit('queue.enqueue');
            },
            dequeue() {
                this.$socket.emit('queue.dequeue');
            },
            updateTime() {
                if(!this.time || !this.timeLength) {
                    this.time = '';
                    return;
                }
                let sec_num = Math.max(Math.ceil((this.timeLength - (Date.now() - this.startTime)) / 1000), 0);
                let hours   = Math.floor(sec_num / 3600);
                let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                let seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (seconds < 10) { seconds = "0" + seconds; }

                let time = "";
                if(hours == 0) {
                    time = minutes + ':' + seconds;
                }
                else {
                    time = hours + ':' + minutes + ':' + seconds;
                }
                this.time = time;
            },
        }
	}
</script>

<style scoped>
    .top-right {
        position:absolute;
        top:0;
        right:0;
    }

    .queue-header {
        text-align: center;
        font-size: x-large;
    }
    .queue-hr {
        margin: 0 0 5px 0;
        height: 1px;
        background-color: lightgray;
        border: none;
    }

    .link {
        color: lightgray;
        text-align: center;
    }
    .link:hover {
        color: white;
        cursor: pointer;
    }
</style>
