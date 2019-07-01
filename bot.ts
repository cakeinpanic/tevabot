import * as _ from 'lodash';
import {Observable, Subject} from 'rxjs/index';
import {delay, filter, map} from 'rxjs/operators';
import {IAction} from './actions';
import {base} from './database/database';
import {firebase} from './database/firebase';

import {
    forwardToAdminChat,
    forwardToMediaChat,
    getUSerToReply,
    IMessage,
    isCommand,
    isFromBot,
    isInAdminChat,
    isInMediaChat,
    isMedia
} from './utils';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || '123456';
export const MESSAGES_TO_IGNORE = [];

export const bot = new TelegramBot(token, {polling: true});

export const $messages = new Subject<IMessage>();

export const $textMessages: Observable<IMessage> = $messages.pipe(filter(({text}) => !!text));

export const $media: Observable<IMessage> = $messages.pipe(
    filter((t) => !isInAdminChat(t)),
    filter((t) => !isInMediaChat(t)),
    filter(isMedia)
);

export const $commands = $messages.pipe(
    filter((t) => isCommand(t))
);

export const $messagesToForwardToAdmins = $messages.pipe(
    filter((t) => !isInAdminChat(t)),
    filter((t) => !isInMediaChat(t)),
    filter((t) => !isMedia(t)),
    filter((t) => !isCommand(t)),
    delay(500),
    filter(({message_id}:IMessage) => {
        var w = _.includes(MESSAGES_TO_IGNORE,message_id);
        _.pull(MESSAGES_TO_IGNORE, message_id);
        return !w;
    }),
);


export const $replysToForwarded = $messages.pipe(
    filter((t) => isInAdminChat(t) || isInMediaChat(t)),
    filter(t => isFromBot(t)),
    map((msg) => ({
        msg,
        replyTo: getUSerToReply(msg)
    })),
    filter(({replyTo}) => !!replyTo)
);

bot.on('message', msg => {
    $messages.next(msg);
    // console.log(msg);
});

$messagesToForwardToAdmins.subscribe(msg => {
    firebase.addMessageToLog(msg);

    forwardToAdminChat(msg).then(msg => {
        base.addForwardedMessage(msg);
    })
});


$media.subscribe(msg => {
    forwardToMediaChat(msg);
});

$replysToForwarded.subscribe(({msg, replyTo}: {msg: IMessage, replyTo: {user: number, message: number}}) => {
    console.log(replyTo);
    // replyToMessage id doesnd work
    bot.sendMessage(replyTo.user, msg.text);
    // bot.sendMessage(replyTo.user, msg.text, {reply_to_message_id: replyTo.message});
})
export const actions: IAction[] = [];


