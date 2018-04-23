<template>
    <section class="main-content">
        <h1 v-if="user&&user.username">Welcome {{user.username}}</h1>
        <v-select
            label="Console"
            :items="queue.consoles"
            v-model="console"
        ></v-select>
        <v-select
            label="Game"
            :items="queue.games"
            v-model="game"
        ></v-select>
        <v-select
            label="Party Size"
            :items="queue.squadSizes"
            v-model="squadSizeSelected"
        ></v-select>

        <v-btn @click="joinQueue()">queue up</v-btn>
        <div v-if="queue.queue">{{queue.queue.length}}</div>
    </section>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        name: 'home',
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
            console: {
                get: function () {
                    return this.queue.console;
                },
                set: function (newValue) {
                    this.$store.dispatch("queue/setConsole", newValue);
                }
            },
            game: {
                get: function () {
                    return this.queue.game;
                },
                set: function (newValue) {
                    this.$store.dispatch("queue/setGame", newValue);
                }
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
             joinQueue() {
                this.inQueue = true;
                var vm = this;

                if (vm.inQueue == true) {
                    vm.$store.dispatch("queue/makeLobbies");
                }
            },
        },
        mounted () {
        },
        created() {
            this.$store.dispatch("queue/getQueue");
        }
    }
</script>

<style lang="scss" scoped>
</style>
