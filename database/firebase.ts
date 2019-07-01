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

const usersFDB = fdb.collection('users').doc('users');


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

    addUser(user) {
        return usersFDB.set({[user.id]:user}, {merge: true});
    }

    saveUsers(users) {
        usersDB.set(users);
    }

    readUsers() {
        return usersFDB.get().then((s) => {
            return s.data();
        }).catch((err) => {
            console.log('Error getting documents', err);
        });
    }

    addMessageToLog(message) {
        var newStoreRef = messagesDB.push();
        newStoreRef.set(message)
    }

    getLoggedMessages() {
        this.getSmth(messagesDB).thne(t => {
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

    private getSmth(db) {
        return db.once("value").then((snapshot) => {
            return snapshot.val();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
            return [];
        });
    }
}

export const firebase = new Database();