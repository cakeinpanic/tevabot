import {filter, map} from 'rxjs/operators';
import {$commands, $textMessages, sendMessageToBot} from '../bot';
import {base} from '../database/database';
import {firebase} from '../database/firebase';
import {filterByWord, IMessage, isFromUser, isInAdminChat, isInMediaChat, isInMessagesChat, mapByMatch} from '../utils';
import {SET_GROUP} from './buttons';
import {addUSerToGroup, sendMessageToGroup} from './groups';

const $setGroup = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    filter(t => filterByWord(t, SET_GROUP))
);

const $getLists = $textMessages.pipe(
    filter((msg) => isInAdminChat(msg)),
    filter(({text}: IMessage) => text === 'список' || text === 'Список')
);

const $getStat = $textMessages.pipe(
    filter((msg) => isInAdminChat(msg)),
    filter(({text}: IMessage) => text === 'стата' || text === 'Стата')
);

const $sendToGroup = $textMessages.pipe(
    filter((msg) => isInAdminChat(msg) || isInMediaChat(msg) || isInMessagesChat(msg)),
    map(mapByMatch(/^[sS]end/)),
    filter(({match}) => !!match)
);

const $messageFromUser = $textMessages.pipe(
    filter((msg) => !isInAdminChat(msg)),
    filter((msg) => !isInMediaChat(msg)),
    filter((msg) => !isInMessagesChat(msg))
);


$messageFromUser.subscribe((msg: IMessage) => base.addUser(msg.from));
$setGroup.subscribe((msg) => addUSerToGroup(msg.from.id));


$sendToGroup.subscribe(({msg}) => sendMessageToGroup(msg));
$getLists.subscribe(msg => {
    sendMessageToBot(msg.chat.id, base.formGroupsList(), {parse_mode: 'Markdown'})
})

$getStat.subscribe(msg => {
    firebase.getFactsAndBoredCount();
})