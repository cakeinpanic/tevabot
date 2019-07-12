import {Subject} from 'rxjs/internal/Subject';
import {IBoring} from '../bot/boring';
import {IMessage, IUser} from '../bot/entities';
import {IFacts} from '../bot/facts';
import {BORED, FACT} from '../bot/groups/buttons';
import {ISettings} from '../bot/settings';

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
const boringDB = fdb.collection('boring').doc('boring');

console.log('fb');

class Database {
    facts$ = new Subject<IFacts>();
    users$ = new Subject<{[key: string]: IUser}>();
    $settings = new Subject<ISettings>();
    $boring = new Subject<IBoring>();

    constructor() {
        this.connect()
    }

    private connect() {
        factsBD.onSnapshot((s) => this.getFactsFromSnapshot(s));
        settingsDB.onSnapshot(s => this.applySettings(s.data()));
        boringDB.onSnapshot(s => this.$boring.next(s.data()));

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

    getFactsAndBoredCount(): Promise<any> {
        return messagesDB.get().then(s => this.getLogs(s))
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

        var boring = messages.filter(({text}) => text === BORED);
        var fact = messages.filter(({text}) => text === FACT);

        return {fact: fact.length, boring: boring.length}

    }

    private applySettings(newSettings) {
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
