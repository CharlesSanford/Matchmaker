import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from '@/store/store'
//import router from '@/router'
import axios from 'axios'
axios.defaults.baseURL = process.env.API_URL

// The following two interceptor blocks are strickly for
// attaching the top-loading bar to all axios requests and
// stoping the bar on all responses.
// axios.interceptors.request.use(function (config) {
//     router.app.$Progress.start()
//     return config
// }, function (error) {
//     router.app.$Progress.fail()
//     return Promise.reject(error)
// })
// axios.interceptors.response.use(function (response) {
//     router.app.$Progress.finish()
//     return response
// }, function (error) {
//     router.app.$Progress.fail()
//     return Promise.reject(error)
// })

// axios.interceptors.response.use((response) => {
//     return response
// }, async (error) => {
//     let originalRequest = error.config
//     if (error.response.status === 401 && error.response.data.message === 'TOKEN_EXPIRED' && !originalRequest._retry) {
//         originalRequest._retry = true
//         try {
//             const response = await store.dispatch('user/refreshUserTokens')
//             await store.dispatch('user/setUserAndTokens', {accessToken: response.data.accessToken, refreshToken: response.data.refreshToken})
//             originalRequest.headers['Authorization'] = 'Bearer ' + store.getters['user/accessToken']
//             return axios(originalRequest)
//         } catch (error) {
//             // All Vuex modules must logout here
//             await store.dispatch('user/userLogout')
//             await store.dispatch('user/userLogout')

//             router.replace({name: 'login'})
//             Vue.toasted.error('To verify your session, please login.')
//             return Promise.reject(error)
//         }
//     }
//     return Promise.reject(error)
// })

const SET_USER = 'SET_USER'
const CREATE_USER = 'CREATE_USER'

const user = {
    namespaced: true,
    state: {
        user: null,
    },
    mutations: {
        SET_USER (state, data) {
            state.user = data
        },
        CREATE_USER (state) {
            state.user = null
        },

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
                    lobbyId: data.lobbyId ? data.lobbyId : "12345",
                })
                console.log('user '+data.steamId+' created!')
            } catch (error) {
                throw new Error(error)
            }
        },
        async setUser ({ dispatch, commit, getters, rootGetters }, data) {
            try {
                //console.log(data)
                commit(SET_USER, data)
                console.log('user '+data.steamId+' set!')
            } catch (error) {
                throw new Error(error)
            }
        },
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