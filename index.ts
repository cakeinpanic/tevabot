const CHAT_ID = 123456;
import './actions.ts';
import {$messages, bot} from './bot';
import {base} from './database';

import './sendingMessagesToGroups.ts';


bot.on('message', msg => {
    $messages.next(msg);
});


function processMessageFromUser(msg) {
    const chatId = msg.chat.id;
    base.addUser(msg.from);
    // bot.sendMessage(chatId, 'Received your message');
}

function processMessageInChat(msg) {
    forwardMessageToAdminChat(msg.from.id, msg.message_id);
}

function sendMessageToAdminChat(message) {
    bot.sendMessage(CHAT_ID, message);
}

function forwardMessageToAdminChat(fromChatId, messageId) {
    bot.forwardMessage(CHAT_ID, fromChatId, messageId);
}
