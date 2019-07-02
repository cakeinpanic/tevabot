import {filter, map} from 'rxjs/operators';
import {$commands, $textMessages, sendMessageToBot} from '../bot';
import {base} from '../database/database';
import {IMessage, isFromUser, isInAdminChat, isInMediaChat, isInMessagesChat, mapByMatch, setGroupName} from '../utils';
import {addUSerToGroup, sendMessageToGroup} from './groups';

const $setGroup = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    map(mapByMatch(new RegExp(`/${setGroupName}`))),
    filter(({match}) => !!match)
);

const $getLists = $textMessages.pipe(
    filter((msg) => isInAdminChat(msg)),
    filter(({text}: IMessage) => text === 'список' || text === 'Список')
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
$setGroup.subscribe(({msg}) => addUSerToGroup(msg.from.id));


$sendToGroup.subscribe(({msg}) => sendMessageToGroup(msg));
$getLists.subscribe(msg => {
    sendMessageToBot(msg.chat.id, base.formGroupsList(), {parse_mode: 'Markdown'})
})