import {filter, map} from 'rxjs/operators';
import {$messages} from '../bot';
import {isFromUser, isInAdminChat} from '../utils';
import {addUSerToGroup, sendMessageToGroup} from './groups';

export const $setGroup = $messages.pipe(
    filter(({text}) => !!text),
    filter((msg) => isFromUser(msg)),
    map((msg: any) => ({
            msg,
            match: msg.text.match(/\/setgroup/) || msg.text.match(/\/start/)
        })
    ),
    filter(({match}) => !!match)
);

export const $sendToGroup = $messages.pipe(
    filter(({text}) => !!text),
    filter((msg) => isInAdminChat(msg)),
    map((msg: any) => ({
            msg,
            match: msg.text.match(/^[sS]end/)
        })
    ),
    filter(({match}) => !!match)
);


$setGroup.subscribe(({msg}) => addUSerToGroup(msg.from.id));


$sendToGroup.subscribe(({msg}) => sendMessageToGroup(msg));
