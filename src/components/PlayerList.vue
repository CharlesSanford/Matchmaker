<template>
<div>
   <div >
       <PlayerListItem 
       v-for="player in players" 
       v-bind:player="player">
       </PlayerListItem>
    </div>
  </div>
</template>

<script>
import PlayerListItem from './PlayerListItem'
import db from '../assets/js/db';

export default {
 name: 'PlayerList',
   components: {
    PlayerListItem
  },
  data () {
    return {
      players: []
    }
  },
  created: function () {
    var vm=this
    db.collection("Queue").doc('duo').collection('steamIds').onSnapshot((querySnapshot) => {
      vm.players=[]
      querySnapshot.forEach((doc) => {
        vm.players.push(doc.data().steamId)
      })
    })
  }
}
</script>

<style>

</style>
