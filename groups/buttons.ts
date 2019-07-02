import {ALL, base, NOBODY} from '../database/database';

export const BORED = 'Мне скучно';
export const SET_GROUP = "Указать свой маршрут";
export const HELP = 'Помощь';
export const FACT = "Рандомный факт";

export const YES_NO = {
    parse_mode: 'Markdown',
    remove_keyboard: true,
    reply_markup: {
        inline_keyboard: [[{text: 'Верно ☘', callback_data: 'true'}], [{
            text: 'Я передумал ❌',
            callback_data: 'false'
        }]],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

export const CHOOSE_GROUP = {
    parse_mode: 'Markdown',
    remove_keyboard: true,
    reply_markup: {
        inline_keyboard: base.getGroupsButtons.concat([[{text: 'Отмена ❌', callback_data: 'false'}]]),
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

export const INLINE_CB = {
    parse_mode: 'Markdown',
    remove_keyboard: false,
    reply_markup: {
        keyboard: [
            [HELP, SET_GROUP],
            [FACT, BORED]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

export const CHOOSE_GROUP_WITH_ALL = {
    parse_mode: 'Markdown',
    remove_keyboard: true,
    reply_markup: {
        inline_keyboard: base.getGroupsButtons.concat([[{
            text: 'Все',
            callback_data: ALL
        }, {text: 'Только те, кто не указал группу', callback_data: NOBODY},]]),
        resize_keyboard: true,
        one_time_keyboard: false
    }
};