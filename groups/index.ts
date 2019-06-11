import {filter, map} from 'rxjs/operators';
import {$textMessages} from '../bot';
import {mapByMatch, isFromUser, isInAdminChat} from '../utils';
import {addUSerToGroup, sendMessageToGroup} from './groups';

const $setGroup = $textMessages.pipe(
    filter((msg) => isFromUser(msg)),
    map(mapByMatch(/\/setgroup/,/\/start/ )),
    filter(({match}) => !!match)
);

const $sendToGroup = $textMessages.pipe(
    filter((msg) => isInAdminChat(msg)),
    map(mapByMatch(/^[sS]end/)),
    filter(({match}) => !!match)
);

$setGroup.subscribe(({msg}) => addUSerToGroup(msg.from.id));


$sendToGroup.subscribe(({msg}) => sendMessageToGroup(msg));
