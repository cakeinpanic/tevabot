import {Subject} from 'rxjs/internal/Subject';
import {IFacts} from '../facts/index';
import {IMessage} from '../utils';
import {IUser} from './database';

const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: '123456'
});

const fdb = admin.firestore();

const factsBD = fdb.collection('facts');

const usersFDB = fdb.collection('users').doc('users');
const messagesDB = fdb.collection('messages');

class Database {
    facts$ = new Subject<IFacts>();

    users$ = new Subject< {[key: string]: IUser} >();
    constructor() {
        factsBD.onSnapshot((s) => this.getFactsFromSnapshot(s))
        usersFDB.onSnapshot(e=>{
            this.users$.next(e.data());
        })
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


    addMessageToLog(message:IMessage) {
        messagesDB.doc(message.chat.id + '_' +message.message_id).set(message);

    }


    private getFactsFromSnapshot(snapshot) {
        var res: IFacts = <IFacts>{};
        snapshot.forEach(t => {
            res = {...res, ...t.data()}
        })
        this.facts$.next(res);
    }

}

export const firebase = new Database();