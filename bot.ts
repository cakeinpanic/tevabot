import {Observable, Subject} from 'rxjs/index';
import {filter} from 'rxjs/operators';
import {IAction} from './actions';
import {firebase} from './firebase';
import {
    forwardToAdminChat,
    forwardToMediaChat,
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

bot.on('message', msg => {
    $messages.next(msg);
    // console.log(msg);
});

$messagesToForwardToAdmins.subscribe(msg => {
    firebase.addMessageToLog(msg);
    forwardToAdminChat(msg);
});


$media.subscribe(msg => {
    forwardToMediaChat(msg);
});

export const actions: IAction[] = [];


