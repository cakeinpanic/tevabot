import './actions.ts';
import {bot, MOTHER_CHAT} from './bot';
import {base} from './database';

import './groups';


function processMessageFromUser(msg) {
    const chatId = msg.chat.id;
    base.addUser(msg.from);
    // bot.sendMessage(chatId, 'Received your message');
}

function processMessageInChat(msg) {
    forwardMessageToAdminChat(msg.from.id, msg.message_id);
}

function sendMessageToAdminChat(message) {
    bot.sendMessage(MOTHER_CHAT, message);
}

function forwardMessageToAdminChat(fromChatId, messageId) {
    bot.forwardMessage(MOTHER_CHAT, fromChatId, messageId);
}
