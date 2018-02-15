import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from '@/store/store'
//import router from '@/router'
import axios from 'axios'
axios.defaults.baseURL = process.env.API_URL

const GET_QUEUE = 'GET_QUEUE'
const ADD_USER_TO_QUEUE = 'ADD_USER_TO_QUEUE'
const REMOVE_USER_FROM_QUEUE = 'REMOVE_USER_FROM_QUEUE'
const SET_SQUAD_SIZE_SELECTED = 'SET_SQUAD_SIZE_SELECTED'
const SET_IN_QUEUE = 'SET_IN_QUEUE'

const queue = {
    namespaced: true,
    state: {
        queue: null,
        inQueue: false,
        squadSizeSelected: 2,
    },
    mutations: {
        GET_QUEUE(state, data) {
            state.queue = data
        },
        ADD_USER_TO_QUEUE(state, data) {
            state.queue = data
        },
        REMOVE_USER_FROM_QUEUE(state, data) {
            state.queue = null
        },
        SET_SQUAD_SIZE_SELECTED(state, data) {
            state.squadSizeSelected = data
        },
        SET_IN_QUEUE(state, data) {
            state.inQueue = data
        },
    },
    getters: {
        queue: state => {
            return state.queue
        },
        inQueue: state => {
            return state.inQueue
        },
        squadSizeSelected: state => {
            return state.squadSizeSelected
        },
    },
    actions: {
        async getQueue({
            dispatch,
            commit,
            getters,
            rootdGetters
        }) {
            try {

                const response = await axios.get('/api/v1/queue')
                commit(GET_QUEUE, response.data)
                console.log('queue', response.data)
                return response.data
            } catch (error) {
                throw new Error(error)
            }
        },
        async addUserToQueue({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            //console.log(getters.squadSizeSelected)
            try {
                return await axios.post('/api/v1/queue', {
                    steamId: data.steamId,
                    game: 'pubg',
                    size: getters.squadSizeSelected,
                })
            } catch (error) {
                throw new Error(error)
            }
        },
        async removeUserFromQueue({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            try {
                return await axios.delete('/api/v1/queue/' + data)
            } catch (error) {
                throw new Error(error)
            }
        },
        async removeUserFromQueueBySteamId({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            try {
                return await axios.delete('/api/v1/queue/steam/' + data)
            } catch (error) {
                throw new Error(error)
            }
        },
        async setSquadSize({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            commit(SET_SQUAD_SIZE_SELECTED, data)
        },
        async setInQueue({
            dispatch,
            commit,
            getters,
            rootGetters
        }, data) {
            commit(SET_IN_QUEUE, data)
        },
        async makeLobbies({
            dispatch,
            commit,
            getters,
            rootGetters
        }) {
            var lobbyCandidates = []
            let vm = this
            ;

            let steamId = rootGetters['user/user'].steamId;

            vm._vm.$socket.emit("user-added-to-queue", steamId)
            dispatch("addUserToQueue", rootGetters['user/user']).then(function(){
                dispatch("getQueue").then(function(queue) {
                    console.log(queue)
                    for (var i in queue) {
                        if (queue[i].size == getters.squadSizeSelected && queue[i].game == 'pubg') {
                            console.log('pushing lobbycandidates')
                            lobbyCandidates.push(queue[i]);
                        }
                    }
                    console.log('lobbycandidates', lobbyCandidates)
                    if (lobbyCandidates.length % getters.squadSizeSelected == 0) {
                        var lobbyCount = lobbyCandidates.length / getters.squadSizeSelected;
                        for (var i = 0; i < lobbyCount; i++) {
                            var myLobby = false
                            var lobbyMembers = [];
                            for (var j = 0; j < getters.squadSizeSelected; j++) {
                                if(lobbyCandidates[j].steamId===steamId) {
                                    myLobby = true
                                }
                                lobbyMembers.push(lobbyCandidates[j]);
                            }

                            dispatch("lobby/createLobby", getters.squadSizeSelected, {
                                root: true
                            }).then(function(lobbyData) {
                                console.log('lobbyData',lobbyData);

                                var emitObject = {
                                    'lobbyId': lobbyData.data.lobbyId[0],
                                    'lobbyMembers': lobbyMembers
                                }
                                console.log('emitObject',emitObject);

                                vm._vm.$socket.emit("lobby-set-for-users", emitObject)
                            })
                        }
                    } else {
                        var lobbyCount =
                            (lobbyCandidates.length -
                                lobbyCandidates.length % getters.squadSizeSelected) /
                            getters.squadSizeSelected;

                        for (var i = 0; i < lobbyCount; i++) {
                            var lobbyMembers = [];
                            for (var j = 0; j < getters.squadSizeSelected; j++) {
                                lobbyMembers.push(lobbyCandidates[j]);
                            }

                            dispatch("lobby/createLobby", getters.squadSizeSelected, {
                                root: true
                            }).then(function(lobbyData) {
                                console.log('lobbyData',lobbyData);

                                var emitObject = {
                                    'lobbyId': lobbyData.data.lobbyId[0],
                                    'lobbyMembers': lobbyMembers
                                }
                                console.log('emitObject',emitObject);

                                vm._vm.$socket.emit("lobby-set-for-users", emitObject)
                            })
                        }
                    }
                })
            })

        }
    }
}

export default queue
