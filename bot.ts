import {Observable, Subject} from 'rxjs/index';
import {filter, map} from 'rxjs/operators';
import {IAction} from './actions';
import {base} from './database';
import {firebase} from './firebase';
import {
    forwardToAdminChat,
    forwardToMediaChat,
    getUSerToReply,
    IMessage,
    isCommand,
    isInAdminChat,
    isInMediaChat,
    isMedia
} from './utils';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || '123456';

export const bot = new TelegramBot(token, {polling: true});

export const $messages = new Subject<IMessage>();

export const $textMessages: Observable<IMessage> = $messages.pipe(filter(({text}) => !!text));

export const $media: Observable<IMessage> = $messages.pipe(
    filter((t) => !isInAdminChat(t)),
    filter((t) => !isInMediaChat(t)),
    filter(isMedia));

export const $messagesToForwardToAdmins = $messages.pipe(
    filter((t) => !isInAdminChat(t)),
    filter((t) => !isInMediaChat(t)),
    filter((t) => !isMedia(t)),
    filter((t) => !isCommand(t))
);

export const $replysToForwarded = $messages.pipe(
    filter((t) => isInAdminChat(t) || isInMediaChat(t)),
    map((msg) => ({
        msg,
        replyTo: getUSerToReply(msg)
    }))
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
    bot.sendMessage(replyTo.user, msg.text, {reply_to_message_id: replyTo.message});
})
export const actions: IAction[] = [];


