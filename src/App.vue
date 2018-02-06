<template>
  <div id="app">
    <SSHeader v-bind:steamId="steamId"/>
    <div> Just type your Steam ID below, choose your squad size and queue up!</div>
    <div class="input-container">
      <input class="uk-input input" v-model.lazy="user.steamId">
      <button class="uk-button button" @click="addUser"> Set ID </button>
    </div>
    <div v-if="!steamIdValid">NOPE!</div>
    <button @click="squadSizeSelected = 2" class="button__duo" v-bind:class="{ 'active' : squadSizeSelected==2 }">2</button>
    <button @click="squadSizeSelected = 4"  class="button__squad" v-bind:class="{ 'active' : squadSizeSelected==4 }">4</button>
    <button @click="joinQueue()" class="button__queue">Queue Up!</button>
    <Lobby/>
    <PlayerList/>
  </div>
</template>

<script>
import SSHeader from './components/SSHeader'
import HelloWorld from './components/HelloWorld'
import PlayerList from './components/PlayerList'
import Lobby from './components/Lobby'
import cheerio from 'cheerio'
import request from 'request'
import { mapState } from 'vuex'


export default {
  name: 'app',
  components: {
    SSHeader,
    HelloWorld,
    PlayerList,
    Lobby
  },
  data () {
    return {
      user: {
        steamId: '',
        lobbyId: '',
      },
      socket: io.connect('http://localhost:4000/')
    }
  },
  watch: {
    inQueue: function (val) {
      if(val) {
        this.socket.on('user-added-to-queue', function(data) {  
          console.log('socket data',data);
        })
      }
    },
  },
  computed: {
    steamId: {
      get() {
        return this.$store.state.steamId   
      },
      set(newValue) {
        this.$store.commit('setSteamId', newValue)
      }
    },
    lobbyId: {
      get() {
        return this.$store.state.lobbyId  
      },
      set(newValue) {
        this.$store.commit('setLobbyId', newValue)
      }
    },    
    steamIdValid: {
      get() {
        return this.$store.state.steamIdValid 
      },
      set(newValue) {
        this.$store.commit('setSteamIdValid', newValue)
      }
      
    },
    squadSizeSelected: {
      get() {
        return this.$store.state.squadSizeSelected
      },
      set(newValue) {
        this.$store.commit('setSquadSizeSelected', newValue)
      }
    },
    inQueue: {
      get() {
      return this.$store.state.inQueue
      },
      set(newValue) {
        this.$store.commit('setInQueue', newValue)
      }
    }
  },
  methods: {
    joinQueue() {
      this.inQueue=true
      var vm = this
      // db.collection('Queue').doc(this.squadSizeSelected==2 ? 'duo' : 'squad').collection('steamIds').doc(vm.steamId).set({
      //   steamId: vm.steamId
      // })    

        if (vm.inQueue == true) {
          vm.squadUp()
        }

    },
    squadUp() {
      var vm = this
        db.collection('Queue').doc(vm.squadSizeSelected==2 ? 'duo' : 'squad').collection('steamIds').get().then(function(querySnapshot) {
          console.log('size: '+querySnapshot.size)
          if (querySnapshot.size >= (vm.squadSizeSelected)) {
            console.log('querysnap length is great enough')

            var payload = {
              count: vm.squadSizeSelected,
              players: []
            }
            var pCount = 0

          querySnapshot.forEach(function(doc) {
            
            if (pCount<vm.squadSizeSelected) {
              pCount++

              switch (pCount) {    
                case 1:
                  console.log(pCount)
                  payload.players.push(doc.data().steamId)
                  break
                case 2:
                  console.log(pCount)
                  payload.players.push(doc.data().steamId)
                  break
                case 3:
                  console.log(pCount)
                  payload.players.push(doc.data().steamId)
                  break
                case 4:
                  console.log(pCount)
                  payload.players.push(doc.data().steamId)
                  break
                default:
                  break
              }   
            } 
            if (pCount==vm.squadSizeSelected) {
              console.log('made it into else')
              console.log(payload)
              pCount=0

              if ((vm.squadSizeSelected==2 ? payload.players[1] : payload.players[3])!='') {

                console.log('made it into if')

                db.collection('Lobbies').add(payload)
                console.log('lobby added')
                db.collection('Lobbies').get().then(function(querySnapshot) {
                  console.log(querySnapshot)
                  querySnapshot.forEach(function(doc) {
                    console.log(doc.id, " => ", doc.data())
                    //if(doc.data().players.includes({steamId: vm.steamId})) {
                    if(doc.data().players[0]==vm.steamId || doc.data().players[1]==vm.steamId ||  doc.data().players[2]==vm.steamId || doc.data().players[3]==vm.steamId) {
                      vm.lobbyId=doc.id
                    }
                  })
                })
                vm.inQueue=false;
              }
            }
          })   
          } 
        })

    },
    validatesteamId() {
      var vm = this;

      request('https://cors-anywhere.herokuapp.com/'+'http://steamcommunity.com/id/'+this.steamId,  function (error, response) {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(response.body)
            if (!$('div .error_ctn').hasClass('error_ctn')) {
              vm.steamIdValid = true
              vm.$store.dispatch('user/setUser', vm.user)
              vm.$store.dispatch('user/createUser', vm.user)
              vm.socket.emit('user-added', {
                user: vm.user
              })
              document.cookie = 'steamId='+vm.steamId+';'
            } else {
              vm.steamIdValid = false
            }
          } else {
            console.log(error)
          }
      })
    },
    addUser() {
      this.validatesteamId()
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
      this.steamId = this.getCookie("steamId")
    if (document.cookie) {
      this.steamId = this.getCookie("steamId")
    }
  },
  mounted: function() {
    this.socket.on('user-added', function(data) {
      console.log('socket data',data);
    })

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
