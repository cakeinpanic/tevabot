import {filter, first, map} from 'rxjs/operators';
import {$commands, $messages, bot, MESSAGES_TO_IGNORE, sendMessageToBot} from '../bot';
import {base} from '../database/database';
import {sendAbout} from '../help';
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
    sendMessageToBot(from, 'Привет! Укажи, пожалуйста, свое имя и фамилию(чтобы мы могли сверить списки). И мы сразу же начнем!');
    $messages
        .pipe(
            filter((m: IMessage) => from === m.from.id),
            first()
        )
        .subscribe(t => {
            MESSAGES_TO_IGNORE.push(t.message_id)
            base.setName(from, t.text);
            sendMessageToBot(t.from.id, 'Ура, добро пожаловать на борт! Сейчас я расскажу про себя 😊').then(() => {
                sendAbout(t.from.id);
            })

        })
});
