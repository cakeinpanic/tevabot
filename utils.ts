import * as _ from 'lodash';
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


export function getMessageContent(msg) {
    if (msg.text) {
        return msg.text
    }
    if (msg.sticker) {
        return msg.sticker.emoji;
    }
}

export function mapByMatch(...rgs) {
    return (msg: any) => ({
        msg,
        match: _.find(rgs.map(rg => msg.text.match(rg)), (match => !!match))
    })
}