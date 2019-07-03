import {Subject} from 'rxjs/internal/Subject';
import {sendMessageToBot} from '../bot';
import {IFacts} from '../facts/index';
import {BORED, FACT} from '../groups/buttons';
import {ISettings} from '../settings';
import {IMessage, MOTHER_CHAT} from '../utils';
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
const settingsDB = fdb.collection('settings').doc('settings');

class Database {
    facts$ = new Subject<IFacts>();

    users$ = new Subject<{[key: string]: IUser}>();
    $settings = new Subject<ISettings>();

    constructor() {
        factsBD.onSnapshot((s) => this.getFactsFromSnapshot(s))
        settingsDB.onSnapshot(s => this.applySettings(s.data()))


        usersFDB.onSnapshot(e => {
            this.users$.next(e.data());
        });
        this.getFacts();
    }

    getFacts() {
        return factsBD.get().then((s) => {
            this.getFactsFromSnapshot(s)
        }).catch((err) => {
            console.log('Error getting documents', err);
        });

    }

    getFactsAndBoredCount(){
        messagesDB.get().then(s => this.getLogs(s)).then((data)=>{
            sendMessageToBot(MOTHER_CHAT, JSON.stringify(data));
        });
    }

    addUser(user) {
        return usersFDB.set({[user.id]: user}, {merge: true});
    }


    addMessageToLog(message: IMessage) {
        messagesDB.doc(message.chat.id + '_' + message.message_id).set(message);
    }

    private getLogs(logsSnapshot) {
        var messages: IMessage[] = []
        logsSnapshot.forEach(t => {
            messages.push(t.data());
        });

        var boring = messages.filter(({text})=>text === BORED);
        var fact = messages.filter(({text})=>text === FACT);

        return {fact: fact.length, boring: boring.length}

    }

    private applySettings(newSettings) {
        console.log(newSettings);
        this.$settings.next(newSettings)
    }

    private getFactsFromSnapshot(snapshot) {
        var res: IFacts = <IFacts>{};
        snapshot.forEach(t => {
            res = {...res, ...t.data()}
        });
        this.facts$.next(res);
    }

}

export const firebase = new Database();