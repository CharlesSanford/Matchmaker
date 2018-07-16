import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from '@/store/store'
//import router from '@/router'
import axios from 'axios'
axios.defaults.baseURL = process.env.API_URL
import { setAuthorizationHeader } from '@/common/utilities'
import { normalize, schema } from 'normalizr';

const user = new schema.Entity('users', undefined, {
    idAttribute: 'id'
})
const player = new schema.Entity('players', undefined, {
    idAttribute: 'userId'
})
const playerSchema = [ player ]

const SET_LOBBY = 'SET_LOBBY'
const SET_LOBBY_PLAYERS = 'SET_LOBBY_PLAYERS'
const UPDATE_LOBBY_PLAYERS = 'UPDATE_LOBBY_PLAYERS'
const UPDATE_ENTITIES = 'UPDATE_ENTITIES'
const OVERWRITE_ENTITIES = 'OVERWRITE_ENTITIES'



const lobby = {
    namespaced: true,
    state: {
        entities: {
            users: {},
            players: {}
        },
        lobby: null,
        players: [],
        inLobby: false,
    },
    mutations: {
        UPDATE_ENTITIES(state, {entities}) {
            // Loop over all kinds of entities we received
            console.log({entities})
            console.log(entities)
            for (let type in entities) {
                for (let entity in entities[type]) {
                    console.log('entity', entity)
                    const oldObj = state.entities[type][entity] || {}
                    console.log('oldobj', oldObj)
                    // Merge the new data in the old object
                    const newObj = Object.assign(oldObj, entities[type][entity])
                    console.log('newobj', newObj)
                    // Make sure new entities are also reactive
                    Vue.set(state.entities[type], entity, newObj)
                }
            }
        },
        OVERWRITE_ENTITIES(state, {entities}) {
            for (let type in entities) {
                for (let entity in entities[type]) {
                    console.log(state.entities[type])
                    console.log(entities)
                    Vue.set(state.entities[type], entity)
                }
            }
        },
        SET_LOBBY(state, data) {
            state.lobby = data
        },
        SET_LOBBY_PLAYERS(state, data) {
            console.log(data)
            state.entities.players = data
        },
        UPDATE_LOBBY_PLAYERS(state, data) {
            // console.log('data',data)
            // console.log('before',state.playersUserData)
            // let newArr = Object.assign(state.playersUserData)
            // console.log()
            // for (let obja of newArr) {
            //     for (let objb of data) {
            //         if(obja.id===objb.id) {
            //             obja = objb
            //         } else {
            //             newArr.push(objb)
            //         }
            //     }
            // }
            // state.playersUserData = newArr
            // console.log('after',state.playersUserData)
            // console.log('after2',newArr)
           state.playersUserData = data
        }
    },
    getters: {
        lobby: state => {
            return state.lobby
        },
        inLobby: state => {
            return state.inLobby
        },
        players: state => {
            return state.players
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
                setAuthorizationHeader(rootGetters['user/accessToken'])
                const response = await axios.post('/api/v1/lobby', {
                    size: data,
                    game: rootGetters['queue/game'],
                    console: rootGetters['queue/console']
                })
                commit(SET_LOBBY, response.data)
                console.log('lobby', response.data)
                return response
            } catch (error) {
                throw new Error(error)
            }
        },
        async setLobbyPlayers({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            console.log(data)
            var normalizedEntity = normalize(data, playerSchema);
            console.log(normalizedEntity)
            commit(SET_LOBBY_PLAYERS, normalizedEntity.entities.players)
        },
        async overwriteLobbyPlayers({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            console.log(data)
            var normalizedEntity = normalize(data, playerSchema);
            console.log(normalizedEntity)
            commit(SET_LOBBY_PLAYERS, normalizedEntity.entities.players)
        },
        async getLobbyPlayers({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            try {
                setAuthorizationHeader(rootGetters['user/accessToken'])
                const response = await axios.get('/api/v1/lobby/'+data)
                var normalizedEntity = normalize(response.data[0], playerSchema);
                commit(UPDATE_ENTITIES, { entities: normalizedEntity.entities })
                return response
            } catch (error) {
                throw new Error(error)
            }
        },
        async fetchUserData({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            try {
                setAuthorizationHeader(rootGetters['user/accessToken'])
                const response = await axios.get('/api/v1/user/'+data)
                var normalizedEntity = normalize(response.data[0], user);
                commit(UPDATE_ENTITIES, { entities: normalizedEntity.entities })
                return response
            } catch (error) {
                throw new Error(error)
            }
        },

        async fetchLobbyPlayers({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            try {
                setAuthorizationHeader(rootGetters['user/accessToken'])
                const response = await axios.get('/api/v1/user?lobbyId=' + data)
                console.log(response.data)
                var normalizedEntity = normalize(response.data, [user]);
                console.log(normalizedEntity)
                commit(SET_LOBBY_PLAYERS, normalizedEntity.entities.users)
                return response
            } catch (error) {
                throw new Error(error)
            }
        }

    }
}

export default lobby
