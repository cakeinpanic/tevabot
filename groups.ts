import {filter, map} from 'rxjs/operators';
import {$messages, actions, bot} from './bot';
import {base} from './database';
import {isFromAdmin, isFromUser, isInAdminChat} from './utils';

const YES_NO = {
    parse_mode: 'Markdown',
    remove_keyboard: true,
    reply_markup: {
        inline_keyboard: [[{text: 'Верно', callback_data: 'true'}], [{text: 'Я передумал', callback_data: 'false'}]],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

const CHOOSE_GROUP = {
    parse_mode: 'Markdown',
    remove_keyboard: true,
    reply_markup: {
        inline_keyboard: base.getGroupsButtons,
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

export const $setGroup = $messages.pipe(
    filter(({text}) => !!text),
    filter((msg) => isFromUser(msg)),
    map((msg: any) => ({
            msg,
            match: msg.text.match(/\/setgroup/)
        })
    ),
    filter(({match}) => !!match)
);


export const $sendToGroup = $messages.pipe(
    // filter(({text}) => !!text),
    filter((msg) => isInAdminChat(msg)),
    map((msg: any) => ({
            msg,
            match: msg.text.match(/^[sS]end/)
        })
    ),
    filter(({match}) => !!match)
);


$setGroup.subscribe(({msg}) => addToGroup(msg.from.id));


$sendToGroup.subscribe(({msg}) => sendMessageToGroup(msg));


function addToGroup(userId) {
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

function sendMessageToGroup(msg) {
    const reply = msg.reply_to_message;
    const chatId = msg.chat.id;
    const textToSend = reply.text;
    const originalMessageId = reply.message_id;
    if (!reply || !isFromAdmin(msg)) {
        return;
    }

    bot.sendMessage(chatId, `выберите группу для отправки сообщения \n"${textToSend.substring(0, 40)}..."`, CHOOSE_GROUP)
        .then(theMessage => {
            actions.push({
                id: theMessage.message_id,
                cb: (groupId) => {
                    confirmGroupChoose(chatId, textToSend, groupId,originalMessageId);
                },
                remove: true
            })
        });
}


function confirmGroupChoose(chatId, textToSend, groupId, originalMessageId) {
    bot.sendMessage(
        chatId,
        `отправляю сообщение \n"${textToSend.substring(0, 40)}..." в группу:\n "${base.groupsDescription[groupId]}"`,
        YES_NO
    ).then((theMessage => {
        actions.push({
            id: theMessage.message_id,
            cb: (reply) => {
                sendOrNot(reply === 'true', textToSend, groupId)
                bot.sendMessage(
                    chatId,
                    `Отправлено в группу "${base.groupsDescription[groupId]}"`,
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

    base.groups[group].forEach(user => {
        bot.sendMessage(user, msg);
    });
}

function sendToAllUsers(msg) {
    Object.keys(base.groups).forEach((g) => sendToAllUsersInTheGroup(msg, g));
}