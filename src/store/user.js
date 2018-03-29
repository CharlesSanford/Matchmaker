import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from '@/store/store'
import jwtDecode from 'jwt-decode'
import router from '@/router'
import { setAuthorizationHeader } from '@/common/utilities'
import axios from 'axios'
axios.defaults.baseURL = process.env.API_URL

axios.interceptors.response.use((response) => {
    return response
}, async (error) => {
    let originalRequest = error.config
    if (error.response.status === 401 && error.response.data.message === 'TOKEN_EXPIRED' && !originalRequest._retry) {
        originalRequest._retry = true
        try {
            const response = await store.dispatch('user/refreshUserTokens')
            await store.dispatch('user/setUserAndTokens', {accessToken: response.data.accessToken, refreshToken: response.data.refreshToken})
            originalRequest.headers['Authorization'] = 'Bearer ' + store.getters['user/accessToken']
            return axios(originalRequest)
        } catch (error) {
            // All Vuex modules must logout here
            await store.dispatch('user/userLogout')
            await store.dispatch('user/userLogout')

            router.replace({name: 'login'})
            Vue.toasted.error('To verify your session, please login.')
            return Promise.reject(error)
        }
    }
    return Promise.reject(error)
})

const SET_USER = 'SET_USER'
const STORE_ACCESS_TOKEN = 'STORE_ACCESS_TOKEN'
const STORE_REFRESH_TOKEN = 'STORE_REFRESH_TOKEN'
const LOGOUT_USER = 'LOGOUT_USER'
const UPDATE_USER = 'UPDATE_USER'

const user = {
    namespaced: true,
    state: {
        user:{
            email:null,
            id:null,
            isAdmin:0,
            lobbyId:null,
            token:null,
            username:null
        },
        accessToken: null,
        refreshToken: null
    },
    mutations: {
        SET_USER (state, data) {
            state.user = data
        },
        UPDATE_USER (state, data) {
            state.user = data
        },
        STORE_ACCESS_TOKEN (state, accessToken) {
            state.accessToken = accessToken
            localStorage.setItem('accessToken', accessToken)
        },
        STORE_REFRESH_TOKEN (state, refreshToken) {
            state.refreshToken = refreshToken
            localStorage.setItem('refreshToken', refreshToken)
        },
        LOGOUT_USER (state) {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
    },
    getters: {
        user (state) {
            return state.user
        },
        accessToken (state) {
            return state.accessToken
        },
        refreshToken (state) {
            return state.refreshToken
        }
    },
    actions: {
        async setUserAndTokens ({ dispatch, commit, getters, rootGetters }, data) {
            try {
                let decoded = jwtDecode(data.accessToken)
                commit(SET_USER, decoded.data)
                commit(STORE_ACCESS_TOKEN, data.accessToken)
                commit(STORE_REFRESH_TOKEN, data.refreshToken)
            } catch (error) {
                throw new Error(error)
            }
        },
        async userLogin ({ dispatch, commit, getters, rootGetters }, credentials) {
            try {
                const response = await axios.post('/api/v1/user/authenticate', {
                    username: credentials.username,
                    password: credentials.password
                })
                return await dispatch('setUserAndTokens', {accessToken: response.data.accessToken, refreshToken: response.data.refreshToken})
            } catch (error) {
                throw new Error(error)
            }
        },
        async refreshUserTokens ({ dispatch, commit, getters, rootGetters }) {
            try {
                setAuthorizationHeader(rootGetters['user/accessToken'])
                return await axios.post('/api/v1/user/refreshAccessToken', {
                    username: getters.user.username,
                    refreshToken: getters.refreshToken
                })
            } catch (error) {
                throw new Error(error)
            }
        },
        async userLogout ({ dispatch, commit, getters, rootGetters }) {
            try {
                commit(LOGOUT_USER)
            } catch (error) {
                throw new Error(error)
            }
        },
        async userSignup ({ dispatch, commit, getters, rootGetters }, credentials) {
            try {
                return await axios.post('/api/v1/user/signup', {
                    firstName: credentials.firstName,
                    lastName: credentials.lastName,
                    username: credentials.username,
                    email: credentials.email,
                    password: credentials.password
                })
            } catch (error) {
                throw new Error(error)
            }
        },
        async userForgot ({ dispatch, commit, getters, rootGetters }, credentials) {
            try {
                return await axios.post('/api/v1/user/forgot', {
                    email: credentials.email,
                    url: process.env.APP_URL + '/user/reset',
                    type: 'web'
                })
            } catch (error) {
                throw new Error(error)
            }
        },
        async userReset ({ dispatch, commit, getters, rootGetters }, credentials) {
            try {
                return await axios.post('/api/v1/user/resetPassword', {
                    password: credentials.password,
                    passwordResetToken: credentials.passwordResetToken,
                    email: credentials.email
                })
            } catch (error) {
                throw new Error(error)
            }
        },
        async updateUser({ dispatch, commit, getters, rootGetters }, data) {
            try {
                commit(UPDATE_USER, data)
                return await axios.put('/api/v1/user/'+getters.user.id, data)
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}

export default user
