import * as _ from 'lodash';
import {filter} from 'rxjs/operators';
import {$messages} from '../bot';
import {firebase} from '../../database/firebase';
import {usersList} from '../../database/usersList';
import {sendMessageByBot} from '../utils/sendMessage';
import {filterByWord, isFromUser, replyPassive} from '../utils/utils';
import {FACT} from '../groups/buttons';
import {GROUP} from '../groups/entities';
import {CURRENT_SETTINGS} from '../settings/index';


export interface IFacts {
    [GROUP.druzim]: string[],
    [GROUP.kibuz]: string[],
    [GROUP.city]: string[],
    [GROUP.ahmedit]: string[],
    common: string[]
}

const facts: IFacts = {
    [GROUP.druzim]: [],
    [GROUP.kibuz]: [],
    [GROUP.city]: [],
    [GROUP.ahmedit]: [],
    common: []
}

const $getFact = $messages.pipe(
    filter(({text}) => !!text),
    filter((msg) => isFromUser(msg)),
    filter(t => filterByWord(t, FACT))
);


firebase.facts$.subscribe(t => {
    facts[GROUP.druzim] = t[GROUP.druzim].concat(t.common);
    facts[GROUP.kibuz] = t[GROUP.kibuz].concat(t.common);
    facts[GROUP.city] = t[GROUP.city].concat(t.common);
    facts[GROUP.ahmedit] = t[GROUP.ahmedit].concat(t.common);
});

const $active = $getFact.pipe(filter(() => CURRENT_SETTINGS.activated));

const $passive = $getFact.pipe(filter(() => !CURRENT_SETTINGS.activated));


$active.subscribe((msg) => {
    var userGroup = usersList.getUserGroup(msg.from.id);
    var subfacts = facts[userGroup];
    var txt: string;
    if (!subfacts) {
        txt = `Сначала укажи свой маршрут, пожалуйста`;
    } else {
        txt = subfacts[_.random(0, subfacts.length - 1)]
    }
    sendMessageByBot(msg.chat.id, txt)
});

$passive.subscribe((msg) => {
    replyPassive(msg);
});