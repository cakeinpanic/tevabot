import {ALL, base, NOBODY} from '../database/database';

export const YES_NO = {
    parse_mode: 'Markdown',
    remove_keyboard: true,
    reply_markup: {
        inline_keyboard: [[{text: 'Верно', callback_data: 'true'}], [{text: 'Я передумал', callback_data: 'false'}]],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

export const CHOOSE_GROUP = {
    parse_mode: 'Markdown',
    remove_keyboard: true,
    reply_markup: {
        inline_keyboard: base.getGroupsButtons.concat([[{ text: 'Отмена', callback_data: 'false'}]]),
        resize_keyboard: true,
        one_time_keyboard: false
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