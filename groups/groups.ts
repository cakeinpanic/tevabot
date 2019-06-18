import {actions, bot} from '../bot';
import {ALL, base} from '../database';
import {getMessageContent} from '../utils';
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
    if (!reply) {
        return;
    }
    const chatId = msg.chat.id;
    const textToSend = getMessageContent(reply);
    const originalMessageId = reply.message_id;

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
                var sendIt = reply === 'true';
                if (sendIt) {
                    sendOrNot(textToSend, groupId);
                    bot.sendMessage(
                        chatId,
                        `Отправлено в группу ${groupName}`,
                        {reply_to_message_id: originalMessageId}
                    )
                }

            },
            remove: true
        })
    }))

}

function sendOrNot(textToSend: string, groupId: string) {

    if (groupId === 'all') {
        sendToAllUsers(textToSend);
        return;
    }

    sendToAllUsersInTheGroup(textToSend, groupId);


}

function sendToAllUsersInTheGroup(msg, group) {
    console.log(msg, ' writing to group ' + group);

    base.groups[group].filter(t => !!t).forEach(user => {
        bot.sendMessage(user, msg);
    });
}

function sendToAllUsers(msg) {
    console.log(msg, ' writing to all');
    base.users.forEach(({id}) => bot.sendMessage(id, msg));
}