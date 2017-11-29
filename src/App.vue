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
    <Lobby/>
    <PlayerList/>
  </div>
</template>

<script>
import Header from './components/Header'
import HelloWorld from './components/HelloWorld'
import PlayerList from './components/PlayerList'
import Lobby from './components/Lobby'
import cheerio from 'cheerio'
import request from 'request'
import db from './assets/js/db'


export default {
  name: 'app',
  components: {
    Header,
    HelloWorld,
    PlayerList,
    Lobby
  },
  data () {
    return {
      steamid: '',
      lobbyid: '',
      isValid: true,
      squadSizeSelected: 2,
      inQueue: false
    }
  },
  methods: {
    joinQueue() {
      this.inQueue=true
      var vm = this
      db.collection('Queue').doc(this.squadSizeSelected==2 ? 'duo' : 'squad').collection('steamids').doc(vm.steamid).set({
        steamid: vm.steamid
      })
      setTimeout( function() {
        if (vm.inQueue == true) {
          vm.squadUp()
        }
      }, 1000)
      
    },
    squadUp() {
      var vm = this
        db.collection('Queue').doc(vm.squadSizeSelected==2 ? 'duo' : 'squad').collection('steamids').get().then(function(querySnapshot) {
          console.log('size: '+querySnapshot.size)
          if (querySnapshot.size >= (vm.squadSizeSelected)) {
            console.log('querysnap length is great enough')

            var payload = {
              count: vm.squadSizeSelected,
              p1: '',
              p2: '',
              p3: '',
              p4: ''
            }
            var pCount = 0

          querySnapshot.forEach(function(doc) {
            
            if (pCount<vm.squadSizeSelected) {
              pCount++

              switch (pCount) {    
                case 1:
                  console.log(pCount)
                  payload.p1=doc.data()
                  break
                case 2:
                  console.log(pCount)
                  payload.p2=doc.data()
                  break
                case 3:
                  console.log(pCount)
                  payload.p3=doc.data()
                  break
                case 4:
                  console.log(pCount)
                  payload.p4=doc.data()
                  break
                default:
                  break
              }   
            } 
            if (pCount==vm.squadSizeSelected) {
              console.log('made it into else')
              console.log(payload.p2=='')
              console.log(payload)
              pCount=0

              if ((vm.squadSizeSelected==2 ? payload.p2 : payload.p4)!='') {

                console.log('made it into if')

                db.collection('Lobbies').add(payload)
                console.log('lobby added')
                db.collection('Lobbies').get().then(function(querySnapshot) {
                  console.log(querySnapshot)
                  querySnapshot.forEach(function(doc) {
                    console.log(doc.id, " => ", doc.data())
                    if(doc.data().p1.steamid==vm.steamid || doc.data().p2.steamid==vm.steamid ||  doc.data().p3.steamid==vm.steamid || doc.data().p4.steamid==vm.steamid) {
                      vm.lobbyid=doc.id
                    }
                  })
                })

                // db.collection('Lobbies').where("p1", "==", vm.steamid).get().then(function(querySnapshot){
                //   console.log(querySnapshot.size)
                //   console.log(querySnapshot.id)
                //   querySnapshot.forEach(function(doc) {
                //   })
                // })
                // db.collection('Lobbies').where("p2", "==", vm.steamid).get().then(function(querySnapshot){
                //   console.log(querySnapshot.size)
                //   console.log(querySnapshot.id)
                // })
                // db.collection('Lobbies').where("p3", "==", vm.steamid).get().then(function(querySnapshot){
                //   console.log(querySnapshot.size)
                //   console.log(querySnapshot.id)
                // })
                // db.collection('Lobbies').where("p4", "==", vm.steamid).get().then(function(querySnapshot){
                //   console.log(querySnapshot.size)
                //   console.log(querySnapshot.id)
                // })
                vm.inQueue=false;
              }
            }
          })   
          } 
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
              }, { merge: true })
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
      this.steamid = this.getCookie("steamid")
    if (document.cookie) {
      this.steamid = this.getCookie("steamid")
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
