import {filter, first, map} from 'rxjs/operators';
import {$commands, $messages, bot, MESSAGES_TO_IGNORE} from '../bot';
import {base} from '../database/database';
import {IMessage, isFromUser, mapByMatch} from '../utils';

const $start = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    map(mapByMatch(/\/start/))
);

const $setName = $start.pipe(
    filter(({match}) => !!match)
);

$setName.subscribe(({msg}) => {
    var from = msg.from.id;
    bot.sendMessage(from, 'Привет! Укажи, пожалуйста, свое имя и фамилию(чтобы мы могли сверить списки). И мы сразу же начнем!');
    $messages
        .pipe(
            filter((m: IMessage) => from === m.from.id),
            first()
        )
        .subscribe(t => {
            MESSAGES_TO_IGNORE.push(t.message_id)
            base.setName(from, t.text);
        })
});
