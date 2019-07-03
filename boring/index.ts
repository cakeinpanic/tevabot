import {filter} from 'rxjs/operators';
import {$commands, sendMessageToBot} from '../bot';
import {BORED} from '../groups/buttons';
import {CURRENT_SETTINGS} from '../settings';
import {filterByWord, isFromUser, replyPassive} from '../utils';

const $boring = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    filter(t=> filterByWord(t,BORED))
);

const $active = $boring.pipe(filter(() => CURRENT_SETTINGS.activated));

const $passive = $boring.pipe(filter(() => !CURRENT_SETTINGS.activated));

$active.subscribe((msg) => {
    sendMessageToBot(msg.from.id, 'Тут будет угарное задание')
})

$passive.subscribe((msg) => {
    replyPassive(msg);
})


