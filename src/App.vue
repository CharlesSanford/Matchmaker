<template>
  <div  id="app">
    <input class="uk-input" v-model="steamid">
    <div v-if="!isValid">NOPE!</div>
    <button class="uk-button" @click="addUser"> > </button>
    <PlayerList/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import PlayerList from './components/PlayerList'
import cheerio from 'cheerio'
import needle from 'needle'
import request from 'request'
import db from './assets/js/db'


export default {
  name: 'app',
  components: {
    HelloWorld,
    PlayerList
  },
  data () {
    return {
      steamid: '',
      isValid: true
    }
  },
  methods: {
    validateSteamid() {
      var vm = this;

      request('https://cors-anywhere.herokuapp.com/'+'http://steamcommunity.com/id/'+this.steamid,  function (error, response) {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(response.body)
            if (!$('div .error_ctn').hasClass('error_ctn')) {
              vm.isValid = true
              db.collection('Users').doc(vm.steamid).set({
                steamid: vm.steamid
              })
              document.cookie = vm.steamid
            } else {
              vm.isValid = false
            }
          } else {
            console.log(error)
          }
      })
    },
    addUser() {
      this.validateSteamid()
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
