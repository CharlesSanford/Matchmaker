<template>
    <div class="lobby">
        <div v-for="player in playersInLobby" v-bind:key="player.text" class="lobby__card">
            <div class="lobby__card-steamid">{{ player.steamId }}</div>
            <button v-if="steamId==player.steamId" class="lobby__card-leave" @click="leaveLobby">Leave Lobby</button>
        </div>
    </div>
</template>

<script>
    import {
        mapState
    } from "vuex";

    export default {
        name: 'Lobby',
        components: {

        },
        data() {
            return {

            }
        },
        computed: {
            ...mapState({
                user: state => state.user.user,
                queue: state => state.queue,
                socket: state => state.socket,
                lobby: state => state.lobby,
            }),
            steamId() {
                return this.user.steamId;
            },
            lobbyId() {
                return this.user.lobbyId;
            },
            playersInLobby: {
                get: function () {
                    return this.lobby.players;
                },
                set: function (newValue) {
                    this.$store.dispatch("lobby/setLobbyPlayers", newValue);
                }
            },
        },
        methods: {
            leaveLobby() {
                var vm = this
                vm.$store.dispatch('user/setLobbyId', null).then(function () {
                    vm.$socket.emit('user-left-lobby', vm.steamId)
                })
            }
        },
        created: function () {
            var vm = this
            vm.$socket.on('user-left-lobby', function (data) {
                console.log("user-left-lobby", data);
                vm.$store.dispatch("lobby/getLobbyPlayers", vm.lobbyId);
            })
        }
    }
</script>

<style lang="scss">
    .lobby {
        width: 100%;
        height: 300px;
        //background-color: gray;
        display: flex;

        &__card {
            width: 50%; //height: 100%;
            background-color: white;
            border-radius: 5px;
            margin: 20px 10px;
            position: relative;
            overflow: hidden;
            border: rgb(229, 229, 229) solid 1px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);


            &-steamid {
                font-family: 'Teko', sans-serif;
                font-size: 45px;
                padding: 15px;
                text-align: left;
                line-height: 45px;
            }

            &-leave {
                width: 100%;
                height: 50px;
                color: white;
                background-color: #EE3B2B;
                position: absolute;
                bottom: 0;
                left: 0;
                border: none;
            }
        }
    }
</style>

