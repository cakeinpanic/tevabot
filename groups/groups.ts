import {actions, bot} from '../bot';
import {ALL, base} from '../database';
import {getMessageContent, isFromAdmin} from '../utils';
import {CHOOSE_GROUP, CHOOSE_GROUP_WITH_ALL, YES_NO} from './buttons';


export function addUSerToGroup(userId) {
    bot.sendMessage(userId, `Выберите группу`, CHOOSE_GROUP).then(t => {
        actions.push({
            id: t.message_id,
            cb: (groupNumber) => {
                base.addUserGroup(userId, groupNumber);
                bot.sendMessage(userId, `Вы добавлены в группу ${base.groupsDescription[groupNumber]}`);
            },
            remove: true
        });
    });
}


export function sendMessageToGroup(msg) {
    const reply = msg.reply_to_message;
    const chatId = msg.chat.id;
    const textToSend = getMessageContent(reply);
    const originalMessageId = reply.message_id;

    if (!reply || !isFromAdmin(msg)) {
        return;
    }

    bot.sendMessage(chatId,
        `выберите группу для отправки этого сообщения`,
        {...CHOOSE_GROUP_WITH_ALL, ... {reply_to_message_id: originalMessageId}}
    )
        .then(theMessage => {
            actions.push({
                id: theMessage.message_id,
                cb: (groupId) => {
                    confirmGroupChoose(chatId, textToSend, groupId, originalMessageId);
                },
                remove: true
            })
        });
}

function confirmGroupChoose(chatId, textToSend, groupId, originalMessageId) {
    const groupName = groupId === ALL ? 'все' : base.groupsDescription[groupId];
    bot.sendMessage(
        chatId,
        `отправляю сообщение в группу ${groupName}`,
        {...YES_NO, ...{reply_to_message_id: originalMessageId}}
    ).then((theMessage => {
        actions.push({
            id: theMessage.message_id,
            cb: (reply) => {
                sendOrNot(reply === 'true', textToSend, groupId);
                bot.sendMessage(
                    chatId,
                    `Отправлено в группу ${groupName}`,
                    {reply_to_message_id: originalMessageId}
                )
            },
            remove: true
        })
    }))

}

function sendOrNot(reply: boolean, textToSend: string, groupId: string) {
    if (!reply) {
        return;
    }

    if (groupId === 'all') {
        sendToAllUsers(textToSend);
        return;
    }

    sendToAllUsersInTheGroup(textToSend, groupId);


}

function sendToAllUsersInTheGroup(msg, group) {
    console.log(msg, ' writing to group ' + group);

    base.groups[group].filter(t=>!!t).forEach(user => {
        bot.sendMessage(user, msg);
    });
}

function sendToAllUsers(msg) {
    Object.keys(base.groups).forEach((g) => sendToAllUsersInTheGroup(msg, g));
}