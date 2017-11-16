<template>
  <div  id="app">
    <input class="uk-input" v-model="steamid">
    <button class="uk-button" @click="addUser"> > </button>
    <PlayerList/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import PlayerList from './components/PlayerList'
import db from './assets/js/db';

export default {
  name: 'app',
  components: {
    HelloWorld,
    PlayerList
  },
  data () {
    return {
      steamid: ''
    }
  },
  methods: {
    addUser() {
      db.collection('Users').add({
        steamid: this.steamid
      })
      document.cookie = this.steamid
    }
  },
  created: function() {
    if (document.cookie) {
      this.steamid=document.cookie
    }
  }

}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: auto;
  margin-top: 60px;
}
.button {
  height: 50px;
  width: 50px;
}
</style>
