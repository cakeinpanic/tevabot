import {MOTHER_CHAT} from './bot';

export const MOTHER = 123456;

export function isFromAdmin(msg) {
    const chatId = msg.from.id;
    return chatId === MOTHER;
}

export function isFromUser(msg) {
    const chatId = msg.chat.id;
    return chatId > 0;
}

export function isInAdminChat(msg) {
    const chatId = msg.chat.id;
    return chatId === MOTHER_CHAT;
}
