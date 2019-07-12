import {usersList} from '../../database/usersList';
import {IMessage} from '../entities';
import {sendMessageByBot} from '../utils/sendMessage';
import {actions, getMessageContent} from '../utils/utils';
import {CHOOSE_GROUP, CHOOSE_GROUP_WITH_ALL, YES_NO} from './buttons';
import {ALL, DESCRIPRIONS, NOBODY, NOT_GREETED} from './entities';

export function addUSerToGroup(userId) {
    var currentGroup = usersList.getUserGroup(userId);
    var prefix = !!currentGroup ? `Сейчас ты в группе ${DESCRIPRIONS[currentGroup]}\n` : '';

    sendMessageByBot(userId, prefix + `Выбери группу`, CHOOSE_GROUP).then(t => {
        actions.push({
            id: t.message_id,
            cb: groupNumber => {
                if (groupNumber === 'false') {
                    return;
                }
                usersList.addUserGroup(userId, groupNumber);
                sendMessageByBot(
                    userId,
                    `Ты добавлен в группу ${
                        DESCRIPRIONS[groupNumber]
                    }. Теперь тебе будет приходить информация только для этой группы`
                );
            },
            remove: true
        });
    });
}

export function sendMessageToGroup(msg) {
    console.log('TO GROUP!');
    const reply = msg.reply_to_message;
    if (!reply) {
        return;
    }
    const chatId = msg.chat.id;
    const textToSend = getMessageContent(reply);
    const originalMessageId = reply.message_id;

    sendMessageByBot(chatId, `выберите группу для отправки этого сообщения`, {
        ...CHOOSE_GROUP_WITH_ALL,
        ...{reply_to_message_id: originalMessageId}
    }).then(theMessage => {
        actions.push({
            id: theMessage.message_id,
            cb: groupId => {
                confirmGroupChoose(chatId, textToSend, groupId, originalMessageId);
            },
            remove: true
        });
    });
}

function confirmGroupChoose(chatId, textToSend, groupId, originalMessageId) {
    var groupName: string;
    switch (groupId) {
        case ALL:
            groupName = 'все';
            break;
        case NOT_GREETED:
            groupName = 'тех, с кем еще не поздоровались';
            break;
        case NOBODY:
            groupName = 'людей, которые не выбрали группу';
            break;
        default:
            groupName = DESCRIPRIONS[groupId];
    }

    sendMessageByBot(chatId, `отправляю сообщение в группу ${groupName}`, {
        ...YES_NO,
        ...{reply_to_message_id: originalMessageId}
    }).then((theMessage: IMessage) => {
        actions.push({
            id: theMessage.message_id,
            cb: reply => {
                var sendIt = reply === 'true';
                if (sendIt) {
                    sendOrNot(textToSend, groupId);
                    sendMessageByBot(chatId, `Отправлено в группу ${groupName}`, {
                        reply_to_message_id: originalMessageId
                    });
                }
            },
            remove: true
        });
    });
}

function sendOrNot(textToSend: string, groupId: string) {
    if (groupId === ALL) {
        sendToAllUsers(textToSend);
        return;
    }

    sendToAllUsersInTheGroup(textToSend, groupId);
}

function sendToAllUsersInTheGroup(msg, group) {
    usersList.getUsers(group).forEach(user => {
        sendMessageByBot(user.id, msg);
    });
}

export function sendToAllUsers(msg) {
    usersList.getUsers().forEach(({id}) => sendMessageByBot(id, msg).catch(err => {}));
}
