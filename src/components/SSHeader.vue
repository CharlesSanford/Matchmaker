<template>
    <div class="header">
        <div class="header__left">
            <div class="header__logo">
                SS
            </div>
            <div class="header__title">
                SquadSeeker
            </div>
        </div>
        <div class="header__right" @click="toggleUserDrawer">
            <img class="header__game" v-if="game==='pubg'" src="../assets/images/pubg-icon.jpg">
            <img class="header__game" v-if="game==='fortnite'" src="../assets/images/fortnite-icon.jpeg">
            <svg  v-if="squadSizeSelected===2" class="header__size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 512"><path d="M97 0c35.3 0 64 28.7 64 64s-28.7 64-64 64S33 99.3 33 64 61.7 0 97 0M145 144h-11.4c-22.7 10.4-49.6 10.9-73.3 0H49c-26.5 0-48 21.5-48 48v136c0 13.3 10.7 24 24 24h16v136c0 13.3 10.7 24 24 24h64c13.3 0 24-10.7 24-24V352h16c13.3 0 24-10.7 24-24V192C193 165.5 171.5 144 145 144z"/><path d="M303 0c35.3 0 64 28.7 64 64s-28.7 64-64 64 -64-28.7-64-64S267.7 0 303 0M351 144h-11.4c-22.7 10.4-49.6 10.9-73.3 0H255c-26.5 0-48 21.5-48 48v136c0 13.3 10.7 24 24 24h16v136c0 13.3 10.7 24 24 24h64c13.3 0 24-10.7 24-24V352h16c13.3 0 24-10.7 24-24V192C399 165.5 377.5 144 351 144z"/></svg>
            <svg v-if="squadSizeSelected===4" class="header__size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 512"><path d="M299 0c35.3 0 64 28.7 64 64s-28.7 64-64 64 -64-28.7-64-64S263.7 0 299 0M347 144h-11.4c-22.7 10.4-49.6 10.9-73.3 0H251c-26.5 0-48 21.5-48 48v136c0 13.3 10.7 24 24 24h16v136c0 13.3 10.7 24 24 24h64c13.3 0 24-10.7 24-24V352h16c13.3 0 24-10.7 24-24V192C395 165.5 373.5 144 347 144z"/><path d="M96 0c35.3 0 64 28.7 64 64s-28.7 64-64 64S32 99.3 32 64 60.7 0 96 0M144 144h-11.4c-22.7 10.4-49.6 10.9-73.3 0H48c-26.5 0-48 21.5-48 48v136c0 13.3 10.7 24 24 24h16v136c0 13.3 10.7 24 24 24h64c13.3 0 24-10.7 24-24V352h16c13.3 0 24-10.7 24-24V192C192 165.5 170.5 144 144 144z"/><path d="M705 0c35.3 0 64 28.7 64 64s-28.7 64-64 64 -64-28.7-64-64S669.7 0 705 0M753 144h-11.4c-22.7 10.4-49.6 10.9-73.3 0H657c-26.5 0-48 21.5-48 48v136c0 13.3 10.7 24 24 24h16v136c0 13.3 10.7 24 24 24h64c13.3 0 24-10.7 24-24V352h16c13.3 0 24-10.7 24-24V192C801 165.5 779.5 144 753 144z"/><path d="M502 0c35.3 0 64 28.7 64 64s-28.7 64-64 64 -64-28.7-64-64S466.7 0 502 0M550 144h-11.4c-22.7 10.4-49.6 10.9-73.3 0H454c-26.5 0-48 21.5-48 48v136c0 13.3 10.7 24 24 24h16v136c0 13.3 10.7 24 24 24h64c13.3 0 24-10.7 24-24V352h16c13.3 0 24-10.7 24-24V192C598 165.5 576.5 144 550 144z"/></svg>
            <div class="header__id">{{steamId}}</div>
            <font-awesome-icon :icon="icon" class="header__gear"/>
        </div>
        <div class="header__drawer" v-bind:class="{ 'active' : userDrawerOpen }">
            <h3>Change UserID</h3>
            <input class="uk-input input" v-model="inputText" @keyup.enter="setUser">
            <h3>Change Squad Size</h3>
            <button @click="squadSizeSelected = 2" class="button__duo" v-bind:class="{ 'active' : squadSizeSelected===2 }">2</button>
            <button @click="squadSizeSelected = 4" class="button__squad" v-bind:class="{ 'active' : squadSizeSelected===4 }">4</button>
            <h3>Change Game</h3>
            <div>coming soon</div>

        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faCog } from '@fortawesome/fontawesome-free-solid'


export default {
    name: 'SSHeader',
    data () {
        return {
            inputText: '',
            userDrawerOpen: false
        }
    },
    computed: {
        ...mapState({
            user: state => state.user.user,
            queue: state => state.queue,
            socket: state => state.socket,
            lobby: state => state.lobby,
        }),
        icon () {
            return faCog
        },
        squadSizeSelected: {
            get: function () {
                return this.queue.squadSizeSelected;
            },
            set: function (newValue) {
                this.$store.dispatch("queue/setSquadSize", newValue);
            }
        },
        game() {
            return this.queue.game;
        },
        steamId() {
            return this.user.steamId;
        },
    },
    components: {
        FontAwesomeIcon
    },
    methods: {
        toggleUserDrawer() {
            this.userDrawerOpen=!this.userDrawerOpen
        },
        setUser() {
            var vm = this;
            if (vm.inputText.length > 0) {
                vm.$store.dispatch("user/setUser", vm.inputText)
            }
        },
    }
}
</script>

<style lang="scss">
@import "./src/assets/scss/base";


.header {
    position: relative;
    height: 60px;
    width: 100%;
    background-color: $primary-color;
    font-family: 'Teko', sans-serif;

    &__left {
        float: left;
        display: flex;
        flex-direction: row;
    }

    &__right {
        float: right;
        display: flex;
        flex-direction: row;
        height: 100%;
        align-items: center;
        cursor: pointer;
        position: relative;
    }

    &__game {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        margin: 0 10px;
    }

    &__size {
        fill: white;
        height: 20px;
        margin: 0 10px;
    }

    &__gear {
        font-size: 22px;
        margin: 0 10px;
        color: white;
    }

    &__logo {
        margin-left: 5px;
        text-align: left;
        font-size: 70px;
        color: white;
        line-height: 68px;
    }

    &__title {
        margin-left: 30px;
        text-align: left;
        font-size: 30px;
        color: white;
        line-height: 60px;
    }

    &__id {
        color: white;
        font-size: 24px;
        font-weight: bold;
        margin: 0 10px;
        margin-top: 3px;
    }

    &__drawer {
        width: 300px;
        max-height: 0px;
        position: absolute;
        top: 60px;
        right: 0;
        height: 500px;
        background: white;
        z-index: 10;
        overflow: hidden;
        transition: all .5s ease;
        transition-property: max-height, border, box-shadow;
        transition-duration: .5s, 1s,.5s;
        box-shadow: 0 0px 0px 0 rgba(0,0,0,0);
        border: rgb(255, 255, 255) solid 1px;
        border-top: 0;
        padding: 0 15px;

        &.active {
            max-height: 500px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            border: rgb(229, 229, 229) solid 1px;
            border-top: 0;
        }
    }

}

</style>
