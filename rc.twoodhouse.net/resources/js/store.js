import Vue from 'vue';
import Vuex from 'vuex';
import enums from './enums';
Vue.use(Vuex);

let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

let store = new Vuex.Store({
    state: {
        rc: null,
        socketId: null,
        queue: [],
        messages: [],
        size: 0,
        name: '',
        stopTime: null,
        windowHeight: 0,
        windowWidth: 0,
        isMobile: isMobile,
        controller: isMobile ? enums.controllers.TOUCH : enums.controllers.KEY,
    },
    getters: {
        isConnected(state) {
            return !!state.socketId;
        },
        rcIsConnected(state) {
            return !!state.rc;
        },
        inQueue(state) {
            return state.queue.filter(user => user.id === state.socketId).length > 0;
        },
        inControl(state) {
            return state.queue.length > 0 && state.queue[0].id === state.socketId;
        },
        windowNeedsRotated(state) {
            return state.isMobile && state.windowHeight > state.windowWidth;
        }
    },
    mutations: {
        addMessage(state, message) {
            state.messages.push(message);
        },
        update(state, payload) {
            Object.assign(state, payload);
        },
    },
});

export default store;
