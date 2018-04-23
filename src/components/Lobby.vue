<template>
    <div v-if="playersInLobby&&playersUserData&&user" class="lobby">
        <div v-for="(player, key) in playersInLobby" class="lobby__card">
            {{key}}
            {{user.id}}
            <div class="lobby__card-steamid" v-if="playersUserData[key]">{{ playersUserData[key].username }}</div>
            <button v-if="playersUserData[key]&&playersUserData[key].id===user.id" class="lobby__card-leave" @click="leaveLobby">Leave Lobby</button>
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
            lobbyId() {
                return this.user.lobbyId;
            },
            playersInLobby: {
                get: function () {
                    return this.lobby.entities.players;
                },
                set: function (newValue) {
                    this.$store.dispatch("lobby/setLobbyPlayers", newValue);
                }
            },
            playersUserData() {
                return this.lobby.entities.users
            },
            // computedPlayers() {
            //     var p = []
            //     for (var i in this.playersInLobby) {
            //        console.log(i)
            //        for (var j in this.playersUserData) {
            //             console.log(j)
            //             if (this.playersInLobby[i].userId===this.playersUserData[j].id) {
            //                 console.log('IF')
            //                 var ip = Object.assign(this.playersInLobby[i], this.playersUserData[j])
            //                 console.log('ip',ip)
            //                 p.push(ip)
            //             }
            //        }
            //     }
            //     return p
            // }
        },
        methods: {
            leaveLobby() {
                var vm = this
                var updatedUser = Object.assign({}, vm.user);
                updatedUser.lobbyId = null
                //delete updatedUser.token
                vm.$store.dispatch("user/updateUser", updatedUser).then(function () {
                    vm.$socket.emit('user-left-lobby', vm.user.id)
                })
            }
        },
        created: function () {
            var vm = this
            //this.$store.dispatch("lobby/getLobbyPlayers", vm.lobbyId);
            for (var i in vm.playersInLobby) {
                //fetch userdata
                console.log('fetching userdata for:', vm.playersInLobby[i].userId)
                vm.$store.dispatch('lobby/fetchUserData', vm.playersInLobby[i].userId)
            }
            vm.$socket.on('user-left-lobby', function (data) {
                console.log("user-left-lobby", data);
                if (vm.lobbyId === null) {
                    vm.$router.push({ name: 'home'})
                } else {
                    var updatedLobby = Object.assign({}, vm.playersInLobby);
                    delete updatedLobby[data]
                    vm.$store.dispatch("lobby/overwriteLobbyPlayers", updatedLobby);
                }
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

