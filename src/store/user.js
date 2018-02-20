import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from '@/store/store'
//import router from '@/router'
import axios from 'axios'
axios.defaults.baseURL = process.env.API_URL


const GET_USER = 'SET_USER'
const UPDATE_USER = 'UPDATE_USER'

const UPDATE_LOBBYID = 'UPDATE_LOBBYID'
const SET_USER = 'SET_USER'
const CREATE_USER = 'CREATE_USER'

const user = {
    namespaced: true,
    state: {
        user: {
            id: null,
            steamId: '',
            lobbyId: '',
        }
    },
    mutations: {
        SET_USER (state, data) {
            state.user = data
        },
        CREATE_USER (state) {
            state.user = null
        },
        UPDATE_LOBBYID (state, data) {
            state.user.lobbyId = data
        }

    },
    getters: {
        user (state) {
            return state.user
        },
    },
    actions: {
        async createUser ({ dispatch, commit, getters, rootGetters }, data) {
            try {
                return await axios.post('/api/v1/users', {
                    steamId: data.steamId,
                    lobbyId: data.lobbyId ? data.lobbyId : null,
                })
                //console.log('user '+data.steamId+' created!')
            } catch (error) {
                throw new Error(error)
            }
        },
        async setUser ({ dispatch, commit, getters, rootGetters }, data) {
            try {
                const response = await axios.get('/api/v1/users/steam/'+data)
                if (response.data.length===0) {
                    await dispatch('createUser', {steamId: data})
                    return await dispatch('setUser', data)
                }
                commit(SET_USER, response.data[0])
                document.cookie = "steamId=" + getters.user.steamId + ";"
                return response
            } catch (error) {
                throw new Error(error)
            }
        },
        async setLobbyId ({ dispatch, commit, getters, rootGetters }, data) {
            try {
                commit(UPDATE_LOBBYID, data)
                return await axios.put('/api/v1/users/'+getters.user.id, {
                    lobbyId: data
                })

            } catch (error) {
                throw new Error(error)
            }
        },
    }
}

export default user
