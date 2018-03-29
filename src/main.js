import Vue from 'vue'
import router from './router'
import store from './store/store'
import App from './App'
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import 'babel-polyfill'

Vue.use(Vuelidate)
Vue.use(Vuetify)


Vue.config.productionTip = false

const socketInstance = io('http://localhost:4000/')
Vue.use(VueSocketIO, socketInstance, store)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
})


