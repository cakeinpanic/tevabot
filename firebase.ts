import {Subject} from 'rxjs/internal/Subject';
import {IFacts} from './facts';

const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: '123456'
});

const fdb = admin.firestore();


const db = admin.database();
const messagesDB = db.ref('messages');
const usersDB = db.ref('users');
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
        })
            .catch((err) => {
                console.log('Error getting documents', err);
            });

    }

    saveUsers(users) {
        usersDB.set(users);
    }

    readUsers() {
        return usersDB.once("value").then((snapshot) => {
            return snapshot.val();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            return [];
        });
    }

    addMessageToLog(message) {
        var newStoreRef = messagesDB.push();
        newStoreRef.set(message)
    }

    getLoggedMessages() {
        messagesDB.once("value").then((snapshot) => {
            console.log(snapshot.val());
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            return [];
        });
    }

    private getFactsFromSnapshot(snapshot) {
        var res: IFacts = <IFacts>{};
        snapshot.forEach(t => {
            res = {...res, ...t.data()}
        })
        this.facts$.next(res);
    }
}

usersDB.on('child_added', function (snapshot, prevChildKey) {
    // const newPost = snapshot.val();
    // console.log('Author: ' + JSON.parse(newPost));
    // console.log('Previous Post ID: ' + prevChildKey);
});


export const firebase = new Database();