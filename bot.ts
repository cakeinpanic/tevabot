import {Subject} from 'rxjs/index';
import {map} from 'rxjs/operators';

import * as _ from 'lodash';

const {filter} = require('rxjs/operators');

const TelegramBot = require('node-telegram-bot-api');
const token = '123456';

export const bot = new TelegramBot(token, {polling: true});

export const $messages = new Subject();

export const actions = [];


