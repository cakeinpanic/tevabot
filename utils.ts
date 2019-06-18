import * as _ from 'lodash';
import {bot} from './bot';

export interface IMessage {
    text: string;
    video: any;
    from: any;
    chat: any;
    document: any;
    voice: any;
    photo: any;
    video_note: any;
}

export const MOTHER = 123456;
export const MEDIA_CHAT = -328868094;
export const MOTHER_CHAT = -123456;

export function isFromAdmin(msg) {
    const chatId = msg.from.id;
    return chatId === MOTHER;
}

export function isFromMother(msg) {
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

export function isInMediaChat(msg) {
    const chatId = msg.chat.id;
    return chatId === MEDIA_CHAT;
}


export function getMessageContent(msg) {
    if(!msg){
        return 'тут чот ошибочка вышла, напиши кате, как так получилось';
    }
    if (msg.text) {
        return msg.text
    }
    if (msg.sticker) {
        return msg.sticker.emoji;
    }
}

export function mapByMatch(...rgs) {
    return (msg: IMessage) => ({
        msg,
        match: _.find(rgs.map(rg => msg.text.match(rg)), (match => !!match))
    })
}

export function forwardToMediaChat(msg) {
    bot.forwardMessage(MEDIA_CHAT, msg.chat.id, msg.message_id)
}

export function forwardToAdminChat(msg) {
    bot.forwardMessage(MOTHER_CHAT, msg.chat.id, msg.message_id)
}

export function isMedia({voice, video, photo, video_note, document}: IMessage) {
    return !!document || !!video || !!voice || !!video_note || !!photo
}

export function isCommand(msg) {
    return !!msg.text && msg.text.match(/^\//);
}