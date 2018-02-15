import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from '@/store/store'
//import router from '@/router'
import axios from 'axios'
axios.defaults.baseURL = process.env.API_URL

const SET_LOBBY = 'SET_LOBBY'


const lobby = {
    namespaced: true,
    state: {
        lobby: null,
        inLobby: false,
    },
    mutations: {
        SET_LOBBY(state, data) {
            state = data
        },
    },
    getters: {
        lobby: state => {
            return state.lobby
        },
        inLobby: state => {
            return state.inLobby
        },
    },
    actions: {
        async createLobby({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            try {
                const response = await axios.post('/api/v1/lobby', {
                    size: data,
                    game: 'pubg'
                })
                commit(SET_LOBBY, response.data)
                console.log('lobby', response.data)
                return response
            } catch (error) {
                throw new Error(error)
            }
        },
    }
}

export default lobby
