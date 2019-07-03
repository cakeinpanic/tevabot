import {Observable, Subject} from 'rxjs/index';
import {filter} from 'rxjs/operators';
import {IAction} from './actions';
import {CURRENT_SETTINGS} from './settings';

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
    return bot.sendMessage(...args).then(t => {
        last = t;
        //DO NOT REMOVE RETURN!!
        return t;
    }).catch(err => {
        console.log(err);
    });
}

