import Vue from 'vue'
import Vuex from 'vuex'
//import * as actions from './actions'
//import * as getters from './getters'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

import user from '@/store/user'
import queue from '@/store/queue'

const store = new Vuex.Store({
  //actions,
  //getters,
  state: {
    steamId: '',
    lobbyId: '',
    steamIdValid: true,
    squadSizeSelected: 2,
    inQueue: false
  },
  mutations: {
    setSteamId(state, payload) {
      state.steamId=payload
    },
    setLobbyId(state, payload) {
      state.lobbyId=payload
    },
    setSteamIdValid(state, payload) {
      state.steamIdValid=payload
    },
    setInQueue(state, payload) {
      state.inQueue=payload
    },
    setSquadSizeSelected(state, payload) {
      state.squadSizeSelected=payload
    } 
  },
  modules: {
    user,
    queue
  },
  strict: debug
})

export default store