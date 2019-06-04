const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = '123456';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const base = require('./database');

const CHAT_ID = 123456;
const utils = require('./utils');

const yesno = {
    parse_mode: "Markdown",
    remove_keyboard: true,
    reply_markup: {
        inline_keyboard: [[{text: "Верно", callback_data: "true", switch_inline_query: "/sss"}], [{
            text: "Я передумал",
            callback_data: "false"
        }]],
        resize_keyboard: true,
        one_time_keyboard: false,
    },
};

// Matches "/echo [whatever]"
bot.onText(/\/setgroup\s*(.+)/, (msg, match) => {
    if (!utils.isFromAdmin(msg)) {
        return;
    }
    // bot.sendChatAction(msg.chat.id,)
    const groupNumber = match[1]; // the captured "whatever"
    base.addUserGroup(msg.from.id, groupNumber);
});

bot.on("callback_query", t => {
    console.log(t);
    bot.editMessageReplyMarkup(
        {
            parse_mode: "Markdown",
        },
        {
            chat_id: t.message.chat.id,
            message_id: t.message.message_id
        });
});
// Matches "/echo [whatever]"
bot.onText(/^[sS]end\s+(.+)/, (msg, match) => {
    const reply = msg.reply_to_message;
    const chatId = msg.chat.id;

    if (!reply || !utils.isFromAdmin(msg)) {
        return;
    }

    bot.sendMessage(chatId, `sending to all participants from group ${match[1]} text:\n "${reply.text}"\n*reply anything to this message to really send it*!`, yesno).then(t => {
        console.log(t);
        const id = bot.onReplyToMessage(chatId, t.message_id, () => {
            bot.removeReplyListener(id);
            if (match[1] === 'all') {
                sendToAllUsers(reply.text);
                return;
            }
            sendToAllUsersInTheGroup(reply.text, match[1]);

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
    base.groups[group].forEach(user => {
        bot.sendMessage(user, msg);
    })
}

function sendToAllUsers(msg) {
    base.groups.forEach((g, i) => sendToAllUsersInTheGroup(msg, i));
}