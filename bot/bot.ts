import {Observable, Subject} from 'rxjs/index';
import {filter} from 'rxjs/operators';
import {IMessage} from './entities';
import {isCommand} from './utils/utils';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || '123456';

export const bot = new TelegramBot(token, {polling: true});

export const $messages = new Subject<IMessage>();

export const $textMessages: Observable<IMessage> = $messages.pipe(filter(({text}) => !!text));

export const $commands: Observable<IMessage> = $textMessages.pipe(filter(t => isCommand(t)));

export function startListeningToMessages() {
    bot.on('message', msg => {
        $messages.next(msg);
    });
}
