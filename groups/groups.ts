import {actions, bot} from '../bot';
import {ALL, base, DESCRIPRIONS, NOBODY} from '../database/database';
import {getMessageContent} from '../utils';
import {CHOOSE_GROUP, CHOOSE_GROUP_WITH_ALL, YES_NO} from './buttons';


export function addUSerToGroup(userId) {
    bot.sendMessage(userId, `Выберите группу`, CHOOSE_GROUP).then(t => {
        actions.push({
            id: t.message_id,
            cb: (groupNumber) => {
                base.addUserGroup(userId, groupNumber);
                bot.sendMessage(userId, `Вы добавлены в группу ${DESCRIPRIONS[groupNumber]}. Теперь вам будет приходить информация только для этой группы`);
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
    var groupName = groupId === ALL ? 'все' : DESCRIPRIONS[groupId];
    if(groupId===NOBODY){
        groupName = 'людей, которые не выбрали группу'
    }
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

    if (groupId === ALL) {
        sendToAllUsers(textToSend);
        return;
    }

    sendToAllUsersInTheGroup(textToSend, groupId);


}

function sendToAllUsersInTheGroup(msg, group) {
    console.log(msg, ' writing to group ' + group);

    base.getUsers(group).forEach(user => {
        bot.sendMessage(user.id, msg);
    });
}

function sendToAllUsers(msg) {
    console.log(msg, ' writing to all');
    base.getUsers().forEach(({id}) => bot.sendMessage(id, msg));
}