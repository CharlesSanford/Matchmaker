import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import store from '@/store/store'
//import router from '@/router'
import axios from 'axios'
axios.defaults.baseURL = process.env.API_URL

const SOCKET_CONNECT = 'SOCKET_CONNECT'
const SOCKET_DISCONNECT = 'SOCKET_DISCONNECT'
const SOCKET_messageChannel = 'SOCKET_messageChannel'

const socket = {
    namespaced: true,
    state: {
        isConnected: false,
        socketMessage: null,
    },
    mutations:{
        SOCKET_CONNECT(state) {
          state.isConnected = true;
        },
    
        SOCKET_DISCONNECT(state) {
          state.isConnected = false;
        },
    
        SOCKET_messageChannel(state, message) {
          state.socketMessage = message
        }
    },
    getters: {
    },
    actions: {
        otherAction: (context, type) => {
            return true;
        },
        socket_userMessage: (context, message) => {
            context.dispatch('newMessage', message);
            context.commit('NEW_MESSAGE_RECEIVED', message);
            if (message.is_important) {
                context.dispatch('alertImportantMessage', message);
            }
            
        }
    }
}

export default socket