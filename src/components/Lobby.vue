<template>
    <div v-if="playersInLobby&&user" class="lobby">
        <div v-for="(player, i) in playersInLobby" :key="i" class="lobby__card">
            {{i}}
            {{user.id}}
            <div class="lobby__card-steamid" v-if="playersInLobby[i]">{{ playersInLobby[i].username }}</div>
            <button v-if="playersInLobby[i]&&playersInLobby[i].id===user.id" class="lobby__card-leave" @click="leaveLobby">Leave Lobby</button>
        </div>
    </div>
</template>

<script>
    import {
        mapState
    } from "vuex";

    export default {
        name: 'Lobby',
        props:['lobbyId'],
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
            playersInLobby: {
                get: function () {
                    return this.lobby.entities.players;
                },
                // set: function (newValue) {
                //     this.$store.dispatch("lobby/setLobbyPlayers", newValue);
                // }
            },
            playersUserData() {
                return this.lobby.entities.users
            },
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

        },
        mounted() {
            var vm = this
            vm.$forceUpdate();
            console.log(vm.lobbyId)
            vm.$store.dispatch("lobby/fetchLobbyPlayers", vm.lobbyId);

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
        },
        updated() {

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

