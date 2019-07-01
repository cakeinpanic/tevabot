import {Subject} from 'rxjs/internal/Subject';
import {IFacts} from '../facts/index';

const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: '123456'
});

const fdb = admin.firestore();


const db = admin.database();
const messagesDB = db.ref('messages');
const usersDB = db.ref('users');
const groupsDB = db.ref('groups');

const factsBD = fdb.collection('facts');


class Database {
    facts$ = new Subject<IFacts>();

    constructor() {
        factsBD.onSnapshot((s) => this.getFactsFromSnapshot(s))
        this.getFacts();
    }

    getFacts() {
        return factsBD.get().then((s) => {
            this.getFactsFromSnapshot(s)
        }).catch((err) => {
                console.log('Error getting documents', err);
            });

    }

    saveUsers(users) {
        usersDB.set(users);
    }

    readUsers() {
        return this.getSmth(usersDB);
    }

    readGroups() {
        return this.getSmth(groupsDB)
    }

    saveGroups(groups){
        console.log(groups);
        return groupsDB.set(groups).catch(t=>{
            console.log(t);
        });
    }

    addMessageToLog(message) {
        var newStoreRef = messagesDB.push();
        newStoreRef.set(message)
    }

    getLoggedMessages() {
       this.getSmth(messagesDB).thne(t=>{
           console.log(t);
       })
    }

    private getFactsFromSnapshot(snapshot) {
        var res: IFacts = <IFacts>{};
        snapshot.forEach(t => {
            res = {...res, ...t.data()}
        })
        this.facts$.next(res);
    }

    private getSmth(db){
        return db.once("value").then((snapshot) => {
            return snapshot.val();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            return [];
        });
    }
}

usersDB.on('child_added', function (snapshot, prevChildKey) {
    // const newPost = snapshot.val();
    // console.log('Author: ' + JSON.parse(newPost));
    // console.log('Previous Post ID: ' + prevChildKey);
});


export const firebase = new Database();