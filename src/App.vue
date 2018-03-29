<template>
    <div id="app">
        <v-app>
            <app-header />
            <v-content>
                <v-container fluid>
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </v-container>
            </v-content>
            <app-footer />
        </v-app>
    </div>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        name: "app",
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
                for (var i in data.lobbyMembers) {

                    if (data.lobbyMembers[i].userId === vm.user.id) {
                        console.log("There is a lobby out there for me!")
                        console.log(data)
                        for (var i in data.lobbyMembers) {
                            vm.$store.dispatch("queue/removeUserFromQueueById", vm.user.id)
                        }
                        var updatedUser = Object.assign({}, vm.user);
                        updatedUser.lobbyId = data.lobbyId
                        delete updatedUser.token
                        vm.$store.dispatch("user/updateUser", updatedUser)
                        vm.playersInLobby = data.lobbyMembers
                        const lid = data.lobbyId
                        vm.$router.push({ name: 'lobby', params: { lobbyId: lid }})
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

