import {filter, map} from 'rxjs/operators';
import {$commands, bot} from '../bot';
import {isFromUser, mapByMatch} from '../utils';

const $boring = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    map(mapByMatch(/\/mneskuchno/)),
    filter(({match}) => !!match)
);

$boring.subscribe(({msg}) => {
    bot.sendMessage(msg.from.id, 'Тут будет угарное задание')
})


