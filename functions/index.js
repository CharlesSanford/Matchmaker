// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.joinLobby = functions.firestore
.document('Lobbies/{lobbyId}')
.onCreate(event => {
  // Get an object representing the document
  // e.g. {'name': 'Marie', 'age': 66}
  var newValue = event.data.data();

  // access a particular field as you would any JS property
  var players = newValue.players;

  var count = newValue.count;
  console.log(players);

  // perform desired operations ...
  if (count===2) {
    console.log('count 2')

    players.forEach(function(player) {
      console.log(player)

      //remove players from queue
      db.collection('Queue').doc('duo').collection('steamIds').doc(player).delete().then(function() {
        console.log(player + ' deleted from duo queue');
      }).catch(function(error) {
        console.error("Error removing duo document: ", error);
      });

      //give players a lobbyId
      db.collection('Users').doc(player).set({
        lobbyId: event.params.lobbyId
      }, { merge: true });


       //remove old lobbies players that are the same as new lobby players

       var lobbies = [];
       var lobbyPlayers = [];
       db.collection('Lobbies').where('players.size', '>', 0)
      .get()
      .then(function(querySnapshot){
        querySnapshot.forEach(function(doc) {
          doc.data().players.forEach(function(lobbyPlayer) {
            if (lobbyPlayer!=player) {
              console.log('lobbyplayer => ',lobbyPlayer);
              lobbyPlayers.push(lobbyPlayer);
            }
          });
        });
        console.log(lobbies);
        console.log(lobbyPlayers);
      })
      .then(function(){
        console.log(lobbies);
        console.log(lobbyPlayers);
        
      })
    });

    //console.log(lobbies);

    //remove any empty lobbies
    // db.collection('Lobbies').where('p1', '==', '').where('p2', '==', '').delete().then(function() {
    //   console.log('empty lobby deleted');
    // }).catch(function(error) {
    //   console.error("Error deleting lobby: ", error);
    // });
  } else {
    //remove from queue
    db.collection('Queue').doc('squad').collection('steamIds').doc(p1).delete().then(function() {
      console.log(p1 + ' deleted from squad queue');
    }).catch(function(error) {
      console.error("Error removing squad document: ", error);
    });
    db.collection('Queue').doc('squad').collection('steamIds').doc(p2).delete().then(function() {
      console.log(p2 + ' deleted from squad queue');
    }).catch(function(error) {
      console.error("Error removing squad document: ", error);
    });
    db.collection('Queue').doc('squad').collection('steamIds').doc(p3).delete().then(function() {
      console.log(p3 + ' deleted from squad queue');
    }).catch(function(error) {
      console.error("Error removing squad document: ", error);
    });  
    db.collection('Queue').doc('squad').collection('steamIds').doc(p4).delete().then(function() {
      console.log(p4 + ' deleted from squad queue');
    }).catch(function(error) {
      console.error("Error removing squad document: ", error);
    });


    //give players a lobbyid
    db.collection('Users').doc(p1).set({
      lobbyId: event.params.lobbyId
    }, { merge: true });
    db.collection('Users').doc(p2).set({
      lobbyId: event.params.lobbyId
    }, { merge: true });
    db.collection('Users').doc(p3).set({
      lobbyId: event.params.lobbyId
    }, { merge: true });
    db.collection('Users').doc(p4).set({
      lobbyId: event.params.lobbyId
    }, { merge: true });
  }
  //return 'ok';
});
