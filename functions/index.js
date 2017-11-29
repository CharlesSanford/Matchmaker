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
  var p1 = newValue.p1.steamid;
  var p2 = newValue.p2.steamid;
  var p3 = newValue.p3.steamid;
  var p4 = newValue.p4.steamid;
  var count = newValue.count;

  // perform desired operations ...
  if (count===2) {
    //remove from queue
    db.collection('Queue').doc('duo').collection('steamids').doc(p1).delete().then(function() {
      console.log(p1 + ' deleted from duo queue');
    }).catch(function(error) {
      console.error("Error removing duo document: ", error);
    });
  
    db.collection('Queue').doc('duo').collection('steamids').doc(p2).delete().then(function() {
      console.log(p2 + ' deleted from duo queue');
    }).catch(function(error) {
      console.error("Error removing duo document: ", error);
    });

    //give players a lobbyid
    db.collection('Users').doc(p1).set({
      lobbyid: event.params.lobbyId
    }, { merge: true });
  } else {
    //remove from queue
    db.collection('Queue').doc('squad').collection('steamids').doc(p1).delete().then(function() {
      console.log(p1 + ' deleted from squad queue');
    }).catch(function(error) {
      console.error("Error removing squad document: ", error);
    });
  
    db.collection('Queue').doc('squad').collection('steamids').doc(p2).delete().then(function() {
      console.log(p2 + ' deleted from squad queue');
    }).catch(function(error) {
      console.error("Error removing squad document: ", error);
    });
    db.collection('Queue').doc('squad').collection('steamids').doc(p3).delete().then(function() {
      console.log(p3 + ' deleted from squad queue');
    }).catch(function(error) {
      console.error("Error removing squad document: ", error);
    });
  
    db.collection('Queue').doc('squad').collection('steamids').doc(p4).delete().then(function() {
      console.log(p4 + ' deleted from squad queue');
    }).catch(function(error) {
      console.error("Error removing squad document: ", error);
    });
  }
  return 'ok';
});
