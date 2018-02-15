import Vue from 'vue'
import Vuex from 'vuex'
//import * as actions from './actions'
//import * as getters from './getters'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

import user from '@/store/user'
import queue from '@/store/queue'
import socket from '@/store/socket'
import lobby from '@/store/lobby'


const store = new Vuex.Store({
  modules: {
    user,
    queue,
    socket,
    lobby,
  },
  strict: debug
})

export default store