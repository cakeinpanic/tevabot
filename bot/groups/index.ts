import {filter, map} from 'rxjs/operators';
import {firebase} from '../../database/firebase';
import {usersList} from '../../database/usersList';
import {$commands, $textMessages} from '../bot';
import {IMessage} from '../entities';
import {sendMessageByBot} from '../utils/sendMessage';
import {
    filterByWord,
    isFromUser,
    isInAdminChat,
    isInMediaChat,
    isInMessagesChat,
    mapByMatch,
    MOTHER_CHAT
} from '../utils/utils';
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


$messageFromUser.subscribe((msg: IMessage) => usersList.addUser(msg.from));
$setGroup.subscribe((msg) => addUSerToGroup(msg.from.id));


$sendToGroup.subscribe(({msg}) => sendMessageToGroup(msg));
$getLists.subscribe(msg => {
    sendMessageByBot(msg.chat.id, usersList.formGroupsList(), {parse_mode: 'Markdown'})
})

$getStat.subscribe(() => {
    firebase.getFactsAndBoredCount().then(data => {
        sendMessageByBot(MOTHER_CHAT, JSON.stringify(data));
    });
})