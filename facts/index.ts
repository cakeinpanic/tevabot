import * as _ from 'lodash';
import {filter, map} from 'rxjs/operators';
import {$messages, bot} from '../bot';
import {base} from '../database/database';
import {firebase} from '../database/firebase';
import {isFromUser, mapByMatch} from '../utils';

const $getFact = $messages.pipe(
    filter(({text}) => !!text),
    filter((msg) => isFromUser(msg)),
    map(mapByMatch(/\/fact/)),
    filter(({match}) => !!match)
);

export interface IFacts {
    druzim: string[],
    datim: string[],
    kibuz: string[]
}

var facts: IFacts = {
    druzim: [],
    datim: [],
    kibuz: []
}

firebase.facts$.subscribe(t => {
    facts = t;
});

$getFact.subscribe(({msg}) => {
    var userGroup = base.getUserGroup(msg.from.id);
    var subfacts = facts[userGroup];
    var txt: string;
    if (!subfacts) {
        txt = 'Выберите свою группу, пожалуйста /setgroup'
    } else {
        txt = subfacts[_.random(0, subfacts.length - 1)]
    }
    bot.sendMessage(msg.chat.id, txt)
})