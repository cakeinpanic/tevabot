import {filter, map} from 'rxjs/operators';
import {$commands, $textMessages} from '../bot';
import {base} from '../database/database';
import {isFromUser, isInAdminChat, isInMediaChat, isInMessagesChat, mapByMatch} from '../utils';
import {addUSerToGroup, sendMessageToGroup} from './groups';

const $setGroup = $commands.pipe(
    filter((msg) => isFromUser(msg)),
    map(mapByMatch(/\/setgroup/)),
    filter(({match}) => !!match)
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

$messageFromUser.subscribe((msg) => base.addUser(msg.from));
$setGroup.subscribe(({msg}) => addUSerToGroup(msg.from.id));


$sendToGroup.subscribe(({msg}) => sendMessageToGroup(msg));
