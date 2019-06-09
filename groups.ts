import {filter, map} from 'rxjs/operators';
import {$messages, actions, bot} from './bot';
import {base} from './database';
import {isFromAdmin, MOTHER} from './utils';

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
    map((msg: any) => ({
            msg,
            match: msg.text.match(/\/setgroup/)
        })
    ),
    filter(({match}) => !!match)
);


export const $sendToGroup = $messages.pipe(
    map((msg: any) => ({
            msg,
            match: msg.text.match(/^[sS]end\s+(.+)/)
        })
    ),
    filter(({match}) => !!match)
);


$setGroup.subscribe(({msg}) => {
    addToGroup(msg.from.id);
});


$sendToGroup.subscribe(({msg, match}) => sendMessageToGroup(msg, match));


function addToGroup(userId) {
    bot.sendMessage(
        userId,
        `Выберите группу`,
        CHOOSE_GROUP
    ).then(t => {
        actions.push({
            id: t.message_id,
            cb: (groupNumber) => {
                base.addUserGroup(userId, groupNumber);
                bot.sendMessage(userId, `Вы добавлены в группу ${base.groupsDescription[groupNumber]}`);
            }
        });
    });


}

function sendMessageToGroup(msg, match) {
    const reply = msg.reply_to_message;
    const chatId = msg.chat.id;

    if (!reply || !isFromAdmin(msg)) {
        return;
    }

    bot.sendMessage(
        chatId,
        `sending to all participants from group ${match[1]} text:\n "${
            reply.text
            }"\n*reply anything to this message to really send it*!`,
        YES_NO
    ).then(t => {
        actions.push({
            id: t.message_id,
            cb: () => {
                if (match[1] === 'all') {
                    sendToAllUsers(reply.text);
                    return;
                }
                sendToAllUsersInTheGroup(reply.text, match[1]);
            }
        });
    });
}


function sendToAllUsersInTheGroup(msg, group) {
    bot.sendMessage(MOTHER, 'writing to group ' + group);
    base.groups[group].forEach(user => {
        bot.sendMessage(user, msg);
    });
}

function sendToAllUsers(msg) {
    bot.sendMessage(MOTHER, 'writing to all');
    Object.keys(base.groups).forEach((g) => sendToAllUsersInTheGroup(msg, g));
}