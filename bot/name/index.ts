import {filter, first, map} from 'rxjs/operators';
import {usersList} from '../../database/usersList';
import {$commands, $messages} from '../bot';
import {IMessage} from '../entities';
import {sendAbout} from '../help/index';
import {sendMessageByBot} from '../utils/sendMessage';
import {isFromUser, mapByMatch, MESSAGES_TO_IGNORE} from '../utils/utils';

const $start = $commands.pipe(
    filter(msg => isFromUser(msg)),
    map(mapByMatch(/^\/start/))
);

const $setName = $start.pipe(filter(({match}) => !!match));

$setName.subscribe(({msg}) => {
    var from = msg.from.id;
    sendMessageByBot(
        from,
        'Привет! Укажи, пожалуйста, свое имя и фамилию (чтобы мы могли сверить списки). И мы сразу же начнем!'
    );
    $messages
        .pipe(
            filter((m: IMessage) => from === m.from.id),
            first()
        )
        .subscribe(t => {
            MESSAGES_TO_IGNORE.push(t.message_id);
            usersList.setName(from, t.text);

            sendAbout(t.from.id, 'Ура, добро пожаловать на борт! Сейчас я расскажу про себя 😊\n');
        });
});
