import {Observable, Subject} from 'rxjs/index';
import {filter} from 'rxjs/operators';
import {IAction} from './actions';

import {IMessage, isCommand} from './utils';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || '123456';

export const MESSAGES_TO_IGNORE = [];
export const actions: IAction[] = [];

export const bot = new TelegramBot(token, {polling: true});

export const $messages = new Subject<IMessage>();

export const $textMessages: Observable<IMessage> = $messages.pipe(
    filter(({text}) => !!text)
);

export const $commands = $textMessages.pipe(
    filter((t) => isCommand(t))
);


export var last: IMessage = null;

bot.on('message', msg => {
    $messages.next(msg);
    // console.log(msg);
});

export function sendMessageToBot(...args) {
    var sender;
    if(typeof args[1] === 'string'){
        sender = bot.sendMessage(...args)
    }
    if(!!args[1].photo) {
        sender = bot.sendPhoto(args[0],args[1].photo)
    }
    if(!!args[1].sticker) {
        sender = bot.sendSticker(args[0],args[1].sticker)
    }
    if(!!args[1].location) {
        sender = bot.sendLocation(args[0],args[1].location.latitude, args[1].location.longitude)
    }
    return sender.then(t => {
        last = t;
        //DO NOT REMOVE RETURN!!
        return t;
    }).catch(err => {
        console.log(err);
    });
}

