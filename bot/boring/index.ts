import * as _ from 'lodash';
import {filter} from 'rxjs/operators';
import {firebase} from '../../database/firebase';
import {$commands} from '../bot';
import {BORED} from '../groups/buttons';
import {sendMessageByBot} from '../utils/sendMessage';
import {CURRENT_SETTINGS} from '../settings/index';
import {filterByWord, isFromUser, replyPassive} from '../utils/utils';

export interface IBoring {
    texts: string[]
}

var BORING_DATA: IBoring = {texts: []};

var PREFIX = 'Чтобы развеселиться, попробуй...🤔 \n';

const $boring = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    filter(t => filterByWord(t, BORED))
);

const $active = $boring.pipe(filter(() => CURRENT_SETTINGS.activated));

const $passive = $boring.pipe(filter(() => !CURRENT_SETTINGS.activated));

$active.subscribe((msg) => {
    sendBoringTask(msg)
});

$passive.subscribe((msg) => {
    replyPassive(msg);
});

firebase.$boring.subscribe(t => {
    BORING_DATA = t;
});

function sendBoringTask(msg) {
    var task = BORING_DATA.texts[_.random(0, BORING_DATA.texts.length - 1)]
    sendMessageByBot(msg.from.id, PREFIX + task)
}

