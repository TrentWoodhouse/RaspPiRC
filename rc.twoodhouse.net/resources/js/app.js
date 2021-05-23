import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueSocketIO from 'vue-socket.io';
import { BootstrapVue } from 'bootstrap-vue';
import config from './config';
import store from './store';
require('dotenv');
require('./bootstrap');

Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(new VueSocketIO({
    connection: process.env.MIX_APP_URL + ':' + config.PORT,
}));
Vue.axios.defaults.baseURL = '/api';

import App from './components/App';
import Home from './components/Home';

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
    ],
});

const app = new Vue({
    el: '#app',
    components: { App },
    router,
    store,
    config,
    render: h => h(App),
});
