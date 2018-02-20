<template>
    <div id="app">
        <SSHeader />
        <div v-if="!steamId">
            <div>Just type your Steam ID below, choose your squad size and queue up!</div>
            <div class="input-container">
                <input class="uk-input input" v-model="inputText" @keyup.enter="setUser">
                <button class="uk-button button" @click="setUser"> Set ID </button>
            </div>
            <button @click="squadSizeSelected = 2" class="button__duo" v-bind:class="{ 'active' : squadSizeSelected===2 }">2</button>
            <button @click="squadSizeSelected = 4" class="button__squad" v-bind:class="{ 'active' : squadSizeSelected===4 }">4</button>
        </div>
        <div class="button__queue-container">
        <button @click="joinQueue()" class="button__queue">Queue Up!</button>
        </div>
        <Lobby/>
        <PlayerList/>
    </div>
</template>

<script>
    import SSHeader from "./components/SSHeader";
    import HelloWorld from "./components/HelloWorld";
    import PlayerList from "./components/PlayerList";
    import Lobby from "./components/Lobby";
    //import cheerio from 'cheerio'
    //import request from 'request'
    import {
        mapState
    } from "vuex";

    export default {
        name: "app",
        components: {
            SSHeader,
            HelloWorld,
            PlayerList,
            Lobby
        },
        sockets: {
            connect: function () {
                console.log("socket connected");
            },
            customEmit: function (val) {
                console.log(
                    'this method was fired by the socket server. eg: io.emit("customEmit", data)'
                );
            }
        },
        data() {
            return {
                inputText: "",
            };
        },
        watch: {
            // inQueue: function (val) {
            //   if(val) {
            //     this.socket.on('user-added-to-queue', function(data) {
            //       console.log('socket data',data);
            //     })
            //   }
            // },
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
            userLobbyId() {
                return this.user.lobbyId;
            },
            lobbyId() {
                return this.lobby.lobbyId;
            },
            game() {
                return this.queue.game;
            },
            playersInLobby: {
                get: function () {
                    return this.lobby.players;
                },
                set: function (newValue) {
                    this.$store.dispatch("lobby/setLobbyPlayers", newValue);
                }
            },
            queueObject() {
                return this.queue.queue;
            },
            // steamIdValid: {
            //   get() {
            //     return this.$store.state.steamIdValid
            //   },
            //   set(newValue) {
            //     this.$store.commit('setSteamIdValid', newValue)
            //   }
            // },
            squadSizeSelected: {
                get: function () {
                    return this.queue.squadSizeSelected;
                },
                set: function (newValue) {
                    this.$store.dispatch("queue/setSquadSize", newValue);
                }
            },
            inQueue: {
                get: function () {
                    return this.queue.inQueue;
                },
                set: function (newValue) {
                    this.$store.dispatch("queue/setInQueue", newValue);
                }
            }
        },
        methods: {
            joinQueue() {
                this.inQueue = true;
                var vm = this;

                if (vm.inQueue == true) {
                    vm.$store.dispatch("queue/makeLobbies");
                }
            },
            setUser() {
                var vm = this;
                if (vm.inputText.length > 0) {
                    vm.$store.dispatch("user/setUser", vm.inputText)
                }
            },
            getCookie(cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(";");
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == " ") {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }
        },
        created: function () {
            var vm = this
            if (document.cookie) {
                var savedSteamId = this.getCookie("steamId");
                this.$store.dispatch("user/setUser", savedSteamId).then(function(user){
                    vm.$store.dispatch("lobby/getLobbyPlayers", user.data[0].lobbyId)
                })
            }
        },
        mounted: function () {
            var vm = this
            this.$socket.on("user-added", function (data) {
                console.log("user-added", data);
            });
            this.$socket.on("user-added-to-queue", function (data) {
                console.log("user-added-to-queue", data);
            });
            this.$socket.on("lobby-set-for-users", function (data) {
                console.log("lobby-set-for-users", data);
                for (var user in data.lobbyMembers) {

                    if (data.lobbyMembers[user].steamId == vm.steamId) {
                        console.log("There is a lobby out there for me!")
                        vm.$store.dispatch("queue/removeUserFromQueueBySteamId", vm.steamId)
                        vm.$store.dispatch("user/setLobbyId", data.lobbyId)
                        vm.playersInLobby = data.lobbyMembers
                    }
                }
            });
        }
    };

</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Teko');
@import "./src/assets/scss/base";

    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #1F292E;
        margin: auto;
    }

    .button {
        background-color: $secondary-color;
        height: 50px;
        width: 300px;
        color: white;
        font-weight: 800;
        font-size: 20px;

        &__duo {
            height: 50px;
            width: 50px;
            background: white;
            border: 1px solid $tertiary-color;

            &.active {
                background: $tertiary-color;
            }
        }

        &__squad {
            height: 50px;
            width: 50px;
            background: white;
            border: 1px solid $tertiary-color;

            &.active {
                background: $tertiary-color;
            }
        }

        &__queue {
            width: 300px;
            height: 100px;
            font-family: 'Teko', sans-serif;
            font-size: 50px;
            font-weight: bold;
            background: $secondary-color;
            color: white;
            border: none;
            margin: auto;
            cursor: pointer;

            &-container {
                display: flex;
                width: 100%;
            }
        }
    }

    .input {
        height: 50px;
    }

    .input-container {
        display: flex;
        flex-direction: row;
    }

</style>

