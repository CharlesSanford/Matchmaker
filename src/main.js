import Vue from 'vue'
import store from './store/store'
import App from './App'
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';

Vue.config.productionTip = false

const socketInstance = io('http://localhost:4000/')
Vue.use(VueSocketIO, socketInstance, store)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})


