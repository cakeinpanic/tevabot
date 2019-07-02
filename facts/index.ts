import * as _ from 'lodash';
import {filter} from 'rxjs/operators';
import {$messages, sendMessageToBot} from '../bot';
import {base, GROUP} from '../database/database';
import {firebase} from '../database/firebase';
import {FACT} from '../groups/buttons';
import {filterByWord, isFromUser, setGroupName} from '../utils';

const $getFact = $messages.pipe(
    filter(({text}) => !!text),
    filter((msg) => isFromUser(msg)),
    filter(t=> filterByWord(t,FACT))
);

export interface IFacts {
    [GROUP.druzim]: string[],
    [GROUP.kibuz]: string[],
    [GROUP.city]: string[],
    [GROUP.ahmedit]: string[],
}

var facts: IFacts = {
    [GROUP.druzim]: [],
    [GROUP.kibuz]: [],
    [GROUP.city]: [],
    [GROUP.ahmedit]: [],
}

firebase.facts$.subscribe(t => {
    facts = t;
});

$getFact.subscribe((msg) => {
    var userGroup = base.getUserGroup(msg.from.id);
    var subfacts = facts[userGroup];
    var txt: string;
    if (!subfacts) {
        txt = `Выбери свою группу, пожалуйста: /${setGroupName}`
    } else {
        txt = subfacts[_.random(0, subfacts.length - 1)]
    }
    sendMessageToBot(msg.chat.id, txt + '\nЕще факт: /fact')
})