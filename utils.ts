import * as _ from 'lodash';
import {filter} from 'rxjs/operators';
import {bot, sendMessageToBot} from './bot';
import {IUser} from './database/database';
import {BORED, FACT, HELP, SET_GROUP} from './groups/buttons';

export interface IMessage {
    text: string;
    video: any;
    document: any;
    voice: any;
    photo: any;
    video_note: any;
    reply_to_message: IMessage;
    message_id: number,
    from: IUser,
    chat: {
        id: number,
        title: string,
        type: string
    },
    forward_from?:
        {
            id: number,
            is_bot: boolean
        }

}

export const BOT_ID = 123456;
export const MOTHER = 123456;
export const MEDIA_CHAT = -123456;
export const MOTHER_CHAT = -123456;
export const MESSAGES_CHAT = -123456;
export const LIST_CHAT = -1001404184705;

export const setGroupName = 'track';

export function isFromBot(msg):boolean {
    return msg.from.id === BOT_ID
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

export function isInMessagesChat(msg) {
    const chatId = msg.chat.id;
    return chatId === MESSAGES_CHAT;
}

export function isInMediaChat(msg) {
    const chatId = msg.chat.id;
    return chatId === MEDIA_CHAT;
}


export function getMessageContent(msg) {
    if (!msg) {
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

export function filterByWord(msg, word) {
    return msg.text && msg.text === word;
}


export function forward(msg, chat) {
    return bot.forwardMessage(chat, msg.chat.id, msg.message_id)
}

export function isMedia({voice, video, photo, video_note, document}: IMessage) {
    return !!document || !!video || !!voice || !!video_note || !!photo
}

export function isCommand(msg: IMessage): boolean {
    return !!msg.text && !!msg.text.match(/^\//) || [BORED, SET_GROUP, HELP, FACT].some(t=> t=== msg.text);
}

export function replyToBot({reply_to_message}: IMessage) {
    return !!reply_to_message && reply_to_message.from.id === BOT_ID
}

export function getUSerToReply(msg: IMessage): {message: number, user: number} {
    var replyTo = msg.reply_to_message;
    if (!replyTo || !replyTo.forward_from) {
        return null
    }

    var initialUser = replyTo.forward_from.id;

    return {
        user: initialUser,
        message: replyTo.message_id
    }
}


export function replyPassive(msg){
    sendMessageToBot(msg.from.id, 'Команды заработают завтра после старта маршрута)')
}