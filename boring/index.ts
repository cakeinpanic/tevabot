import {filter, map} from 'rxjs/operators';
import {$commands, bot, sendMessageToBot} from '../bot';
import {isFromUser, mapByMatch} from '../utils';

const $boring = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    map(mapByMatch(/\/mneskuchno/)),
    filter(({match}) => !!match)
);

$boring.subscribe(({msg}) => {
    sendMessageToBot(msg.from.id, 'Тут будет угарное задание')
})


