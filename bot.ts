import {Subject} from 'rxjs/index';
import {filter} from 'rxjs/operators';
import {IAction} from './actions';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN || '123456';

export const bot = new TelegramBot(token, {polling: true});

export const $messages = new Subject();

export const $textMessages = $messages.pipe(filter(({text}) => !!text));

export const MOTHER_CHAT = -123456;

bot.on('message', msg => {
    $messages.next(msg);
    // console.log('msg',msg);
});

export const actions: IAction[] = [];


