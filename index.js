const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = '123456';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const base = require('./database');

const CHAT_ID = 123456;
const utils = require('./utils');

// Matches "/echo [whatever]"
bot.onText(/\/setgroup\s*(.+)/, (msg, match) => {
    if (!utils.isFromAdmin(msg)) {
        return;
    }
    const groupNumber = match[1]; // the captured "whatever"
    base.addUserGroup(msg.from.id, groupNumber);
});

// Matches "/echo [whatever]"
bot.onText(/^send\s+(.+)/, (msg, match) => {
    const reply = msg.reply_to_message;
    const chatId = msg.chat.id;

    if (!reply || !utils.isFromAdmin(msg)) {
        return;
    }

    bot.sendMessage(chatId,`sending to all participants from group ${match[1]} text:\n "${reply.text}"\nreply anything to this message to really send it!`).then(t=> {
        const id = bot.onReplyToMessage(chatId, t.message_id, () => {
            bot.removeReplyListener(id);
            if(match[1] === 'all') {
                sendToAllUsers(reply.text);
                return;
            }
            sendToAllUsersInTheGroup(reply.text, match[1]);

        });

    });
});

// function subscribeOnNext

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//     console.log(msg);
//     if (utils.isFromAdmin(msg)) {
//         processMessageFromAdmin(msg);
//         return;
//     }
//
//     if (utils.isFromUser(msg)) {
//         processMessageFromUser(msg);
//         return;
//     }
//
//     processMessageInChat(msg);
// });

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

function sendToAllUsersInTheGroup(msg, group){
    base.groups[group].forEach(user=>{
        bot.sendMessage(user, msg);
    })
}

function sendToAllUsers(msg) {
    base.groups.forEach((g,i)=>sendToAllUsersInTheGroup(msg, i));
}