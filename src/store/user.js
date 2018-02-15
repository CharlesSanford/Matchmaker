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
                    lobbyId: data.lobbyId ? data.lobbyId : "",
                })
                //console.log('user '+data.steamId+' created!')
            } catch (error) {
                throw new Error(error)
            }
        },
        async setUser ({ dispatch, commit, getters, rootGetters }, data) {
            try {
                //commit(SET_USER, data)
                const response = await axios.get('/api/v1/users/steam/'+data)
                //console.log(response)
                if (response.data.length===0) {
                    await dispatch('createUser', {steamId: data})
                    return await dispatch('setUser', data)
                }

                commit(SET_USER, response.data[0])
                document.cookie = "steamId=" + getters.user.steamId + ";"


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
        // async setUser ({ dispatch, commit, getters, rootGetters }, data) {
        //     try {
        //         commit(SET_USER, data)
        //     } catch (error) {
        //         throw new Error(error)
        //     }
        // },

        // async userLogin ({ dispatch, commit, getters, rootGetters }, credentials) {
        //     try {
        //         const response = await axios.post('/api/v1/user/authenticate', {
        //             username: credentials.username,
        //             password: credentials.password
        //         })
        //         return await dispatch('setUserAndTokens', {accessToken: response.data.accessToken, refreshToken: response.data.refreshToken})
        //     } catch (error) {
        //         throw new Error(error)
        //     }
        // },
        // async refreshUserTokens ({ dispatch, commit, getters, rootGetters }) {
        //     try {
        //         setAuthorizationHeader(rootGetters['user/accessToken'])
        //         return await axios.post('/api/v1/user/refreshAccessToken', {
        //             username: getters.user.username,
        //             refreshToken: getters.refreshToken
        //         })
        //     } catch (error) {
        //         throw new Error(error)
        //     }
        // },
        // async userLogout ({ dispatch, commit, getters, rootGetters }) {
        //     try {
        //         commit(LOGOUT_USER)
        //     } catch (error) {
        //         throw new Error(error)
        //     }
        // },
        // async userSignup ({ dispatch, commit, getters, rootGetters }, credentials) {
        //     try {
        //         return await axios.post('/api/v1/user/signup', {
        //             firstName: credentials.firstName,
        //             lastName: credentials.lastName,
        //             username: credentials.username,
        //             email: credentials.email,
        //             password: credentials.password
        //         })
        //     } catch (error) {
        //         throw new Error(error)
        //     }
        // },
        // async userForgot ({ dispatch, commit, getters, rootGetters }, credentials) {
        //     try {
        //         return await axios.post('/api/v1/user/forgot', {
        //             email: credentials.email,
        //             url: process.env.APP_URL + '/user/reset',
        //             type: 'web'
        //         })
        //     } catch (error) {
        //         throw new Error(error)
        //     }
        // },
        // async userReset ({ dispatch, commit, getters, rootGetters }, credentials) {
        //     try {
        //         return await axios.post('/api/v1/user/resetPassword', {
        //             password: credentials.password,
        //             passwordResetToken: credentials.passwordResetToken,
        //             email: credentials.email
        //         })
        //     } catch (error) {
        //         throw new Error(error)
        //     }
        // }
    }
}

export default user
