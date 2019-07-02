import {filter} from 'rxjs/operators';
import {$commands, sendMessageToBot} from '../bot';
import {BORED} from '../groups/buttons';
import {filterByWord, isFromUser} from '../utils';

const $boring = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    filter(t=> filterByWord(t,BORED))
);

$boring.subscribe((msg) => {
    sendMessageToBot(msg.from.id, 'Тут будет угарное задание')
})


