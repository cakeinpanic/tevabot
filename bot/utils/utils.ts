import * as _ from 'lodash';
import {config} from '../../config';
import {IAction} from '../actionsHandler/actions';
import {bot} from '../bot';
import {IMessage} from '../entities';
import {BORED, FACT, HELP, SET_GROUP} from '../groups/buttons';
import {sendMessageByBot} from './sendMessage';


export const MESSAGES_TO_IGNORE = [];
export const actions: IAction[] = [];

export function isFromUser(msg) {
    const chatId = msg.chat.id;
    return chatId > 0;
}

export function isInAdminChat(msg) {
    const chatId = msg.chat.id;
    return chatId === config.MOTHER_CHAT;
}

export function isInMessagesChat(msg) {
    const chatId = msg.chat.id;
    return chatId === config.MESSAGES_CHAT;
}

export function isInMediaChat(msg) {
    const chatId = msg.chat.id;
    return chatId === config.MEDIA_CHAT;
}

export function getMessageContent(msg) {
    if (!msg) {
        return 'тут чот ошибочка вышла, напиши кате, как так получилось';
    }
    if (msg.text) {
        return msg.text;
    }
    if (msg.sticker) {
        return {sticker: msg.sticker.file_id};
    }

    if (msg.photo) {
        return {photo: msg.photo[0].file_id};
    }

    if (msg.location) {
        return {location: msg.location};
    }
}

export function mapByMatch(...rgs) {
    return (msg: IMessage) => ({
        msg,
        match: _.find(rgs.map(rg => msg.text.match(rg)), match => !!match)
    });
}

export function filterByWord(msg, word) {
    return msg.text && msg.text === word;
}

export function forward(msg, chat) {
    return bot.forwardMessage(chat, msg.chat.id, msg.message_id);
}

export function isMedia({voice, video, photo, video_note, document}: IMessage) {
    return !!document || !!video || !!voice || !!video_note || !!photo;
}

export function isCommand(msg: IMessage): boolean {
    return (!!msg.text && !!msg.text.match(/^\//)) || [BORED, SET_GROUP, HELP, FACT].some(t => t === msg.text);
}

export function replyToBot({reply_to_message}: IMessage) {
    return !!reply_to_message && reply_to_message.from.id === config.BOT_ID
}

export function getUSerToReply(msg: IMessage): {message: number; user: number} {
    var replyTo = msg.reply_to_message;
    if (!replyTo || !replyTo.forward_from) {
        return null;
    }

    var initialUser = replyTo.forward_from.id;

    return {
        user: initialUser,
        message: replyTo.message_id
    };
}

export function replyPassive(msg) {
    sendMessageByBot(msg.from.id, 'Команды заработают завтра после старта маршрута)');
}
