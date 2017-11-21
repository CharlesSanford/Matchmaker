<template>
  <div id="app">
    <Header v-bind:steamid="steamid"/>
    <div> Just type your Steam ID below, choose your squad size and queue up!</div>
    <div class="input-container">
      <input class="uk-input input" v-model.lazy="steamid">
      <button class="uk-button button" @click="addUser"> Set ID </button>
    </div>
    <div v-if="!isValid">NOPE!</div>
    <button @click="squadSizeSelected = 2" class="button__duo" v-bind:class="{ 'active' : squadSizeSelected==2 }">2</button>
    <button @click="squadSizeSelected = 4"  class="button__squad" v-bind:class="{ 'active' : squadSizeSelected==4 }">4</button>
    <button @click="joinQueue()" class="button__queue">Queue Up!</button>
    <PlayerList/>
  </div>
</template>

<script>
import Header from './components/Header'
import HelloWorld from './components/HelloWorld'
import PlayerList from './components/PlayerList'
import cheerio from 'cheerio'
import request from 'request'
import db from './assets/js/db'


export default {
  name: 'app',
  components: {
    Header,
    HelloWorld,
    PlayerList
  },
  data () {
    return {
      steamid: '',
      isValid: true,
      squadSizeSelected: 4,
      inQueue: false
    }
  },
  methods: {
    joinQueue() {
      this.inQueue=true
      var vm = this
      db.collection('Queue').doc(this.squadSizeSelected==2 ? 'duo' : 'squad').collection('steamids').add({
        steamid: vm.steamid
      })
    },
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
              document.cookie = 'steamid='+vm.steamid+';'
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
    },
    getCookie(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  }

  },
  created: function() {
      this.steamid = this.getCookie("steamid");
    if (document.cookie) {
      this.steamid = this.getCookie("steamid");
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
}

.button {
  background-color: green;
  height: 50px;
  width: 300px;
  color: white;
  font-weight: 800;
  font-size: 20px;

  &__duo {
    height: 50px;
    width: 50px;
    background: white;
    border: 1px solid green;

    &.active {
      background: green;
    }
  }

  &__squad {
    height: 50px;
    width: 50px;
    background: white;
    border: 1px solid green;
  
      &.active {
        background: green;
      }
  }

  &__queue {
    width: auto;
    height: 50px;
    background: blue;
    color: white;
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
