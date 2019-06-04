const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = '123456';

const _ = require('lodash');
const bot = new TelegramBot(token, {polling: true});

const base = require('./database');

const CHAT_ID = 123456;
const utils = require('./utils');

const actions = [];
const yesno = {
    parse_mode: "Markdown",
    remove_keyboard: true,
    reply_markup: {
        inline_keyboard: [
            [
                {text: "Верно", callback_data: "true"}
            ], [
                {text: "Я передумал", callback_data: "false"}
            ]
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
    },
};

bot.onText(/\/setgroup\s*(.+)/, (msg, match) => {
    if (!utils.isFromAdmin(msg)) {
        return;
    }
    const groupNumber = match[1];
    base.addUserGroup(msg.from.id, groupNumber);
});

bot.on("callback_query", t => {
    const action = _.find(actions, {id: t.message.message_id});

    if(action) {
        action.cb();
    }
    bot.editMessageReplyMarkup(
        {
            parse_mode: "Markdown",
        },
        {
            chat_id: t.message.chat.id,
            message_id: t.message.message_id
        });
});

bot.onText(/^[sS]end\s+(.+)/, (msg, match) => {
    const reply = msg.reply_to_message;
    const chatId = msg.chat.id;

    if (!reply || !utils.isFromAdmin(msg)) {
        return;
    }

    bot.sendMessage(chatId, `sending to all participants from group ${match[1]} text:\n "${reply.text}"\n*reply anything to this message to really send it*!`, yesno).then(t => {
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
});

bot.on('message', (msg) => {
    // console.log(msg);
    // if (utils.isFromAdmin(msg)) {
    //     processMessageFromAdmin(msg);
    //     return;
    // }
    //
    // if (utils.isFromUser(msg)) {
    //     processMessageFromUser(msg);
    //     return;
    // }
    //
    // processMessageInChat(msg);
});

function processMessageFromAdmin(msg) {

}

function processMessageFromUser(msg) {
    const chatId = msg.chat.id;
    base.addUser(msg.from)
    // bot.sendMessage(chatId, 'Received your message');
}

function processMessageInChat(msg) {
    forwardMessageToAdminChat(msg.from.id, msg.message_id)
}

function sendMessageToAdminChat(message) {
    bot.sendMessage(CHAT_ID, message);
}

function forwardMessageToAdminChat(fromChatId, messageId) {
    bot.forwardMessage(CHAT_ID, fromChatId, messageId)
}

function sendToAllUsersInTheGroup(msg, group) {
    bot.sendMessage(utils.MOTHER, 'writing to group '+ group)
    base.groups[group].forEach(user => {
        bot.sendMessage(user, msg);
    })
}

function sendToAllUsers(msg) {
    bot.sendMessage(utils.MOTHER, 'writing to all')
    base.groups.forEach((g, i) => sendToAllUsersInTheGroup(msg, i));
}