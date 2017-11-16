
import firebase from 'firebase'
require("firebase/firestore")
import cfg from './firestore-config'


firebase.initializeApp(cfg)
var db = firebase.firestore()

export default db