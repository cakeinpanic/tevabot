import {filter, map} from 'rxjs/operators';
import {$commands, bot} from '../bot';
import {isFromUser, mapByMatch} from '../utils';

const $boring = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    map(mapByMatch(/\/mneskuchno/)),
    filter(({match}) => !!match),
    map(({msg}) => msg)
);

$boring.subscribe((from) => {
    bot.sendMessage(from.from.id, 'Тут будет угарное задание')
})


