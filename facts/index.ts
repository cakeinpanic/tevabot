import * as _ from 'lodash';
import {filter} from 'rxjs/operators';
import {$messages, sendMessageToBot} from '../bot';
import {base, GROUP} from '../database/database';
import {firebase} from '../database/firebase';
import {FACT} from '../groups/buttons';
import {CURRENT_SETTINGS} from '../settings';
import {filterByWord, isFromUser, replyPassive} from '../utils';

const $getFact = $messages.pipe(
    filter(({text}) => !!text),
    filter((msg) => isFromUser(msg)),
    filter(t => filterByWord(t, FACT))
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

const $active = $getFact.pipe(filter(() => CURRENT_SETTINGS.activated));

const $passive = $getFact.pipe(filter(() => !CURRENT_SETTINGS.activated));


$active.subscribe((msg) => {
    var userGroup = base.getUserGroup(msg.from.id);
    var subfacts = facts[userGroup];
    var txt: string;
    if (!subfacts) {
        txt = `Сначала укажи свой маршрут, пожалуйста`
    } else {
        txt = subfacts[_.random(0, subfacts.length - 1)]
    }
    sendMessageToBot(msg.chat.id, txt)
})


$passive.subscribe((msg) => {
    replyPassive(msg);
});